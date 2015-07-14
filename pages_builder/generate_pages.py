# coding=utf-8

import os
import pystache
import yaml
import json
import sys
from subprocess import call
from distutils import dir_util
from template_handler import TemplateHandler
from asset_compiler import AssetCompiler
from jinja2 import Template
from pygments import highlight
from pygments.lexers import HtmlLexer, DjangoLexer
from pygments.formatters import HtmlFormatter


class Styleguide_publisher(object):
    "publish a styleguide for the toolkit"

    pages = []

    def __init__(self):
        self.repo_root = os.path.abspath(os.path.join(
            os.path.dirname(__file__), ".."
        ))
        self.pages_dirname = os.path.join(
            self.repo_root, "pages_builder/pages"
        )
        self.output_dirname = os.path.join(self.repo_root, "pages")
        self.template_dir = self.get_template_folder()
        self.template_view = self.get_template_view()
        self.asset_compiler = AssetCompiler()
        self.render_pages()
        self.compile_assets(os.path.join(
            self.repo_root, "pages_builder/assets/scss"
        ))
        self.compile_assets(os.path.join(self.repo_root, "toolkit/scss"))
        self.copy_javascripts()
        self.copy_images()

    def get_version(self):
        return open(
            os.path.join(self.repo_root, "VERSION.txt")
        ).read().rstrip()

    def get_template_folder(self):
        template_handler = TemplateHandler()
        if template_handler.needs_update():
            template_handler.update_template()
        return template_handler.get_folder()

    def get_template_view(self):
        base_template = open(
            os.path.join(
                self.template_dir, "views/layouts/govuk_template.html"
            ), "r"
        ).read()
        return base_template

    def render_pages(self):

        print "\nCREATING PAGES from " + self.pages_dirname + " \n"

        if os.path.isdir(self.output_dirname) is False:
            print "★ Creating " + self.output_dirname
            os.mkdir(self.output_dirname)

        for root, dirs, files in os.walk(self.pages_dirname):
            for dir in dirs:
                output_dir = self.__get_output_dir(dir)
                if os.path.isdir(output_dir) is False:
                    print "★ Creating " + output_dir
                    os.mkdir(output_dir)
                else:
                    print "✔ Found " + output_dir

            for file in files:
                if self.__is_yaml(file):
                    self.render_page(root, file)

    def render_page(self, root, file):
        input_file = os.path.join(root, file)
        output_file = self.__get_page_filename(input_file)
        partial = yaml.load(open(input_file, "r").read())
        url_root = os.getenv("ROOT_DIRECTORY") or ""
        # if main index page, add version number from VERSION.txt
        if self.__is_main_index(output_file):
            partial['content'] = pystache.render(
                partial['content'], {"version": self.get_version()}
            )
        else:
            partial['pageHeading'] = partial['pageTitle']
            partial['pageTitle'] = (
                partial['pageTitle'] +
                " - Digital Marketplace frontend toolkit"
            )
            if "examples" in partial:
                template_name, template_extension = os.path.splitext(file)
                template_subfolder = root.replace(self.pages_dirname, "")
                template_file = os.path.join(
                    self.repo_root,
                    "toolkit/templates",
                    template_subfolder.strip("/"),
                    template_name + ".html"
                )
                parameters_template_file = os.path.join(
                    self.repo_root,
                    "pages_builder/parameters_template.html"
                )
                if (os.path.isfile(template_file)):
                    template = Template(open(template_file, "r").read())
                else:
                    sys.exit("\n⚡ " + template_file + " not found ⚡")
                for index, example in enumerate(partial["examples"]):
                    parameters = dict(partial["examples"][index])
                    if "title" in partial["examples"][index]:
                        # title is a parameter reserved for naming the pattern
                        # in the documentation
                        parameters.pop("title", None)
                    parameters_template = Template(
                        open(parameters_template_file).read()
                    )
                    presented_parameters = {
                        key: json.dumps(value, indent=4)
                        for key, value in parameters.iteritems()
                    }
                    rendered_parameters = parameters_template.render(
                        {
                            "parameters": presented_parameters,
                            "file": template_subfolder.strip("/") + "/" + template_name
                        }
                    )
                    partial["examples"][index]["parameters"] = highlight(
                        rendered_parameters,
                        DjangoLexer(),
                        HtmlFormatter(noclasses=True)
                    )
                    rendered_markup = template.render(
                        partial["examples"][index]
                    )
                    partial["examples"][index]["markup"] = (
                        rendered_markup
                    )
                    partial["examples"][index]["highlighted_markup"] = (
                        highlight(
                            rendered_markup,
                            HtmlLexer(), HtmlFormatter(noclasses=True)
                        )
                    )
                partial['content'] = pystache.render(
                    """
                        <div id="global-breadcrumb" class="header-context">
                          <nav>
                            <ol class="group" role="breadcrumbs">
                              <li>
                                <a href="{{urlRoot}}/">Home</a>
                              </li>
                            </ol>
                          </nav>
                        </div>
                        <main role="main" id="content" class="wrapper">
                            <div id="wrapper">
                                <header class="page-heading">
                                    <h1>{{pageHeading}}</h1>
                                </header>
                                {{#examples}}
                                    {{#title}}<h2>{{title}}</h2>{{/title}}
                                    {{{markup}}}
                                    <div class="code open" data-lang="jinja"><h3 class="code-label">Jinja</h3>{{{parameters}}}</div>
                                    <div class="code open" data-lang="html"><h3 class="code-label">HTML</h3>{{{highlighted_markup}}}</div>
                                {{/examples}}
                            </div>
                        </main>
                    """, {
                        "examples": partial['examples'],
                        "pageTitle": partial['pageTitle'],
                        "pageHeading": partial['pageHeading'],
                        "templateFile": template_file.replace(self.repo_root, "").replace("/toolkit/templates/", ""),
                        "urlRoot": url_root
                    }
                )

        partial['head'] = (
            '<!--[if !IE]><!-->'
            '<link rel="stylesheet" href="' + url_root + '/public/stylesheets/index.css "/>'  # noqa
            '<!--<![endif]-->'
            '<!--[if IE 6]>'
            '<link rel="stylesheet" href="' + url_root + '/public/stylesheets/index-ie6.css "/>'  # noqa
            '<![endif]-->'
            '<!--[if IE 7]>'
            '<link rel="stylesheet" href="' + url_root + '/public/stylesheets/index-ie7.css "/>'  # noqa
            '<![endif]-->'
            '<!--[if IE 8]>'
            '<link rel="stylesheet" href="' + url_root + '/public/stylesheets/index-ie8.css "/>'  # noqa
            '<![endif]-->'
            '<!--[if IE 9]>'
            '<link rel="stylesheet" href="' + url_root + '/public/stylesheets/index-ie9.css "/>'  # noqa
            '<![endif]-->'
        )
        bodyEnd = partial['bodyEnd'] if "bodyEnd" in partial else ""
        partial['bodyEnd'] = (
            '<script type="text/javascript" src="' + url_root + '/public/javascripts/vendor/jquery-1.11.0.js"></script>' +  # noqa
            bodyEnd +
            '<script type="text/javascript" src="' + url_root + '/public/javascripts/onready.js"></script>'  # noqa
        )
        page_render = pystache.render(self.template_view, partial)
        print "\n  " + input_file
        print "▸ " + output_file
        open(output_file, "w+").write(page_render)

    def compile_assets(self, folder):
        print "\nCOMPILING ASSETS from " + folder + "\n"
        self.asset_compiler.compile(folder)

    def copy_javascripts(self):
        print "\nCOPYING JAVASCRIPTS\n"
        dir_util.copy_tree("toolkit/javascripts", "pages/public/javascripts")
        dir_util.copy_tree(
            "pages_builder/assets/javascripts", "pages/public/javascripts/"
        )
        dir_util.copy_tree(
            "pages_builder/govuk_frontend_toolkit/javascripts",
            "pages/public/javascripts/govuk_frontend_toolkit/"
        )
        print "★ Done"

    def copy_images(self):
        print "\nCOPYING IMAGES\n"
        dir_util.copy_tree("toolkit/images", "pages/public/images")
        print "★ Done"

    def __get_output_dir(self, directory):
        return os.path.join(self.output_dirname, directory)

    def __get_page_filename(self, filename):
        filename = filename.replace(self.pages_dirname, self.output_dirname)
        filename_parts = os.path.splitext(filename)
        html_version = filename_parts[0] + ".html"
        return os.path.join(html_version)

    def __is_yaml(self, file):
        filename, extension = os.path.splitext(file)
        return extension == ".yml"

    def __is_main_index(self, filename):
        return filename == os.path.join(self.repo_root, "pages/index.html")

if __name__ == "__main__":
    styleguide_publisher = Styleguide_publisher()
