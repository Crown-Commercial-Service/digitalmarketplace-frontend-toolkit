#!/bin/sh
set -e
echo "≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡"
echo "TAGGING LATEST VERSION"
echo "--------------------------------------------------------------------------------"
git checkout master
git pull origin master
commit=$(git log master --pretty=oneline --abbrev-commit --no-decorate | grep "Bump version to" | head -n1)
sha=$(echo $commit | cut -d ' ' -f1)
version=v$(cat VERSION.txt)
previous_version=$(git describe --abbrev=0)
changes=$(git log --merges --oneline $previous_version..head)
echo Commit:\ \ \ $commit
echo Version:\ \ $version
echo Previous:\ $previous_version
echo "================================================================================"
echo "CHANGES:"
echo $changes
echo "================================================================================"
git tag -a $version -m "Release version $version

Includes:
$changes"
echo "New tag created!"
echo "--------------------------------------------------------------------------------"
