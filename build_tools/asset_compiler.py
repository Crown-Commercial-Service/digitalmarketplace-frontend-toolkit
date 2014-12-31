import os
import sass
import shutil

class AssetCompiler(object):
  def __init__(self):
    self.repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    self.sass_src_root = os.path.join(self.repo_root, "data/assets/stylesheets")
    self.sass_dest_root = os.path.join(self.repo_root, "stylesheets")
    self.default_options = {
      "output_style" : "nested",
      "include_paths" : [
        os.path.join(self.repo_root, "govuk_frontend_toolkit/stylesheets/"),
        os.path.join(self.repo_root, "sass")
      ]
    }
    self.clean()

  def compile_file(self, src_path_abs):
    sass_options = self.default_options
    sass_options["filename"] = src_path_abs
    dest_path_abs = src_path_abs.replace(self.sass_src_root, self.sass_dest_root)
    dest_path_abs = self.__change_extension_to(dest_path_abs, "css")
    result = sass.compile(**sass_options)
    open(dest_path_abs, "w+").write(result)

  def compile(self):
    for root, dirs, files in os.walk(self.sass_src_root):
      for dir in dirs:
        dest_dir = os.path.join(self.sass_dest_root, dir)
        if os.path.isdir(dest_dir) is False:
          os.mkdir(dest_dir)

      for file in files:
        self.compile_file(os.path.join(root, file))

  def clean(self):
    shutil.rmtree(self.sass_dest_root)
    os.mkdir(self.sass_dest_root)

  def __change_extension_to(self, file, new_extension):
    filename, extension = os.path.splitext(file)
    return filename + "." + new_extension

