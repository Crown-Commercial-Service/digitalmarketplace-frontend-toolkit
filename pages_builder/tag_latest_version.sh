#!/bin/sh
set -e
echo "≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡"
echo "TAGGING LATEST VERSION"
echo "--------------------------------------------------------------------------------"
git checkout master
git pull origin master
version=v$(jq -r ".version" package.json)
echo Version:\ \ $version
echo "================================================================================"
git tag -a $version -m "Release version $version"
echo "New tag created!"
echo "--------------------------------------------------------------------------------"
