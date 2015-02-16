#!/bin/sh
set -e
current_branch=$(git rev-parse --abbrev-ref HEAD)
build_from=$1
destination_repo=git@github.com:alphagov/digitalmarketplace-frontend-toolkit.git
destination_branch=gh-pages
echo "================================================================================"
echo "Checking out" $build_from
echo "--------------------------------------------------------------------------------"
if [ $(git status --porcelain | wc -l) -gt 0 ]; then
  echo "ERROR: You have uncommitted changes which would be lost by running this script"; exit
fi
git checkout $build_from
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
python ./pages_builder/generate_pages.py
sed -i -e "s/\[VERSION\]/Digital Marketplace Frontend Toolkit @ $build_from/g" ./pages/index.html
echo "--------------------------------------------------------------------------------"
echo "Commiting changes to generated pages"
echo "--------------------------------------------------------------------------------"
cd pages
git add .
git commit -m "Publishing Digital Marketplace Frontend Toolkit documentation from $build_from"
git push origin $destination_branch
