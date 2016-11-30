#!/bin/sh
set -e
usage () {
  cat << EOF

  Usage: $0

  Build and push the documentation to Github pages based on the latest 
  version of the toolkit. This is typically a release tag, eg v0.0.1, but
  it's no longer mandatory as changes to the documentation do not always
  need a version bump.

EOF
}

while getopts ":h" OPTION; do
  case $OPTION in
    h )
      usage
      exit 1
      ;;
  esac
done
shift $(($OPTIND-1))

latest_tag=$(git describe --abbrev)
latest_commit=$(git rev-parse --short --verify HEAD)
destination_repo=git@github.com:alphagov/digitalmarketplace-frontend-toolkit.git
destination_branch=gh-pages
echo "================================================================================"
echo "Checking out" $build_from
echo "--------------------------------------------------------------------------------"
if [ $(git status --porcelain | wc -l) -gt 0 ]; then
  echo "ERROR: You have uncommitted changes which would be lost by running this script"; exit
fi
git reset --hard HEAD
echo "================================================================================"
echo "Putting branch $destination_branch from $destination_repo into ./pages"
echo "--------------------------------------------------------------------------------"
rm -rf ./pages
mkdir pages
cd ./pages
git clone $destination_repo ./
git checkout $destination_branch
echo "--------------------------------------------------------------------------------"
echo "Generating pages"
echo "--------------------------------------------------------------------------------"
rm -rf ./*
cd ..
make generate_pages
echo "--------------------------------------------------------------------------------"
echo "Commiting changes to generated pages"
echo "--------------------------------------------------------------------------------"
cd pages
git add .
git commit --allow-empty -m "Publish documentation from $latest_commit, at $latest_tag"
git push origin $destination_branch
