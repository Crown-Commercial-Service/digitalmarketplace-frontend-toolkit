# coding=utf-8

import os
import pystache
import yaml
from subprocess import call
from distutils import dir_util
from template_handler import TemplateHandler
from asset_compiler import AssetCompiler

class Styleguide_publisher(object):
  "publish a styleguide for the toolkit"

  GIT_URL = "git@github.com:tombye/test-toolkit.git"
  pages = []

  def __init__(self):
    self.pages_dirname = "markup"
    self.output_dirname = "pages"
    self.template_dir = self.get_template_folder()
    self.template_view = self.get_template_view()
    self.render_pages()
    self.compile_assets("scss")
    self.compile_assets("build_tools/assets/scss")
    self.copy_javascripts()
    self.copy_images()

  def get_template_folder(self):
    template_handler = TemplateHandler()
    if template_handler.needs_update():
      template_handler.update_template()
    return template_handler.get_folder()

  def get_template_view(self):
    base_template = open(os.path.join(self.template_dir, "views/layouts/govuk_template.html"), "r").read()
    return base_template

  def render_pages(self):

    print "\nCREATING PAGES\n"

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
          self.render_page(os.path.join(root, file))

  def render_page(self, input_file):
    output_file = self.__get_page_filename(input_file)
    partial = yaml.load(open(input_file, "r").read())
    page_render = pystache.render(self.template_view, partial)
    print "\n  " + input_file
    print "▸ " + output_file
    open(output_file, "w+").write(page_render)

  def compile_assets(self, folder):
    print "\nCOMPILING ASSETS\n"
    asset_compiler = AssetCompiler()
    asset_compiler.compile(folder)

  def copy_javascripts(self):
    print "\nCOPYING JAVASCRIPTS\n"
    dir_util.copy_tree("javascripts", "pages/public/javascripts")
    dir_util.copy_tree("build_tools/assets/javascripts", "pages/public/javascripts/")
    print "★ Done"

  def copy_images(self):
    print "\nCOPYING IMAGES\n"
    dir_util.copy_tree("images", "pages/public/images")
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

if __name__ == "__main__":
  styleguide_publisher = Styleguide_publisher()
