import os
import pystache
import yaml
from template_handler import TemplateHandler 
from asset_compiler import AssetCompiler

class Styleguide_publisher(object):
  "publish a styleguide for the toolkit"

  GIT_URL = "git@github.com:tombye/test-toolkit.git"
  pages = []

  def __init__(self):
    self.repo_root_rel = os.path.relpath(os.path.join(os.path.dirname(__file__), ".."))
    self.repo_root_abs = os.path.abspath(self.repo_root_rel)
    self.pages_dirname = "data/views"
    self.pages_dir = os.path.join(self.repo_root_rel, self.pages_dirname)
    self.template_dir = self.get_template_folder()
    self.template_view = self.get_template_view()
    self.render_pages()
    self.compile_assets()

  def get_template_folder(self):
    template_handler = TemplateHandler()
    if template_handler.needs_update():
      template_handler.update_template()
    return template_handler.get_folder()

  def get_template_view(self):
    base_template = open(os.path.join(self.template_dir, "views/layouts/govuk_template.html"), "r").read()
    return base_template
    
  def render_pages(self):
    for root, dirs, files in os.walk(self.pages_dir):
      for dir in dirs:
        pages_dir = self.__get_pages_dir(dir)
        if os.path.isdir(pages_dir) is False:
          os.mkdir(pages_dir)

      for file in files:
        if self.__is_yaml(file):
          self.render_page(os.path.join(root, file))

  def render_page(self, filename):
    partial = yaml.load(open(filename, "r").read())
    page_render = pystache.render(self.template_view, partial)
    page_filename = self.__get_page_filename(filename)
    print "creating " + page_filename + " file"
    open(page_filename, "w+").write(page_render)

  def compile_assets(self):
    asset_compiler = AssetCompiler()
    asset_compiler.compile()

  def __get_pages_dir(self, file):
    return file.replace(self.pages_dirname + "/", "")

  def __get_page_filename(self, filename):
    filename_parts = os.path.splitext(filename)
    html_version = filename_parts[0] + ".html"
    return os.path.join(self.repo_root_abs, html_version.replace(self.pages_dirname + "/", ""))

  def __is_yaml(self, file):
    filename, extension = os.path.splitext(file)
    return extension == ".yml"

if __name__ == "__main__":
  styleguide_publisher = Styleguide_publisher()
