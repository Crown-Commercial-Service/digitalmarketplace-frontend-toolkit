# coding=utf-8

import os
import sass
import shutil
import codecs


class AssetCompiler(object):
    def __init__(self):
        self.repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.sass_src_root = os.path.join(self.repo_root, "toolkit/scss")
        self.sass_dest_root = os.path.join(self.repo_root, "pages/public/stylesheets")
        self.sass_default_options = {
            "output_style": "nested",
            "include_paths": [
                os.path.join(self.repo_root, "pages_builder/govuk_frontend_toolkit/stylesheets"),
                os.path.join(self.repo_root, "pages_builder/govuk_elements_sass/public/sass"),
                os.path.join(self.repo_root, "toolkit/scss"),
                os.path.join(self.repo_root, "pages_builder/assets/scss")
            ]
        }
        self.clean()

    def compile_file(self, file, source_folder):
        sass_options = self.sass_default_options
        sass_options["filename"] = os.path.join(source_folder, file)
        dest_path_abs = os.path.join(self.sass_dest_root, file)
        dest_path_abs = self.__change_extension_to(dest_path_abs, "css")
        result = sass.compile(**sass_options)
        print "    " + sass_options["filename"]
        print "▸ " + dest_path_abs
        print ""
        with codecs.open(dest_path_abs, "w+", "utf-8") as file:
            file.write(result)

    def compile(self, folder):
        for root, dirs, files in os.walk(folder):
            for dir in dirs:
                dest_dir = os.path.join(self.sass_dest_root, dir)
                if os.path.isdir(dest_dir) is False:
                    print "★ Creating " + dest_dir
                    os.mkdir(dest_dir)
                else:
                    print "✔ Found " + dest_dir

            print ""

            for file in files:
                if self.__get_filename_parts(file)["extension"] == ".scss":
                    self.compile_file(os.path.join(root, file).replace(folder + "/", ""), folder)

    def clean(self):
        if os.path.isdir('pages/public') is False:
            os.mkdir('pages/public')
        if os.path.isdir(self.sass_dest_root) is True:
            shutil.rmtree(self.sass_dest_root)
        os.mkdir(self.sass_dest_root)

    def __change_extension_to(self, filename, new_extension):
        file = self.__get_filename_parts(filename)
        return file['name'] + "." + new_extension

    def __get_filename_parts(self, filename):
        name, extension = os.path.splitext(filename)
        file = {
            'name': name,
            'extension': extension
        }
        return file
