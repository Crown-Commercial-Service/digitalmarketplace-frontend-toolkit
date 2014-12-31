import os
import tempfile
import requests
import shutil
import tarfile

class TemplateHandler(object):
  version_filename = "VERSION"

  def __init__(self):
    self.repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    self.template_dir = os.path.join(self.repo_root, 'govuk_template')

    self.latest_release = self.get_latest_release()
    self.latest_release_url = "https://github.com/alphagov/govuk_template/releases/download/v0.12.0/mustache_govuk_template-%s.tgz" % self.latest_release
    self.latest_release_filename = self.latest_release_url.split("/")[-1]
    self.latest_release_dirname = self.latest_release_filename.replace(".tgz", "")
  
  def needs_update(self):
    if os.path.isdir(self.template_dir):
      existing_release = open(os.path.join(self.template_dir, self.version_filename), "r").read().splitlines()[0]
      return existing_release != self.latest_release
    else:
      return True

  def get_latest_release(self):
    return "0.12.0"

  def get_folder(self):
    return self.template_dir
  
  def download_archive(self, temp_dir):
    print "Downloading the latest govuk_template (" + self.latest_release + ")"
    temp_tarball_filename = os.path.join(temp_dir, self.latest_release_filename)
    response = requests.get(self.latest_release_url)
    open(temp_tarball_filename, "w").write(response.content)

  def extract_archive(self, temp_dir):
   print "Extracting govuk_template " + self.latest_release + " from tarball"
   tarball = os.path.join(temp_dir, self.latest_release_filename)
   tar_obj = tarfile.open(tarball, "r:gz")
   tar_obj.extractall(temp_dir)

  def update_template(self):
    temp_dir = tempfile.mkdtemp()

    self.download_archive(temp_dir)
    self.extract_archive(temp_dir)
    self.save_archive(temp_dir)

  def save_archive(self, temp_dir):
   template_dir = os.path.join(self.repo_root, self.template_dir)
   template_release_dir = os.path.join(temp_dir, self.latest_release_dirname)

   print "Saving the release to the 'govuk_template' dir"
   shutil.copytree(template_release_dir, template_dir)

  def clean_up(self, temp_dir):
   shutil.rmtree(temp_dir)

