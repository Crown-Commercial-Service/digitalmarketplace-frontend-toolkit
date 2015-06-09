#!/bin/sh
set -e
echo "≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡"
if [[ $(git log master --pretty=oneline --abbrev-commit --no-decorate | grep "Bump version to" | head -n1 | wc -l) -gt 0 ]]; then
  echo "TAGGING LATEST VERSION"
  echo "--------------------------------------------------------------------------------"
  commit=$(git log master --pretty=oneline --abbrev-commit --no-decorate | grep "Bump version to" | head -n1)
  commit_message_parts=($commit)
  sha=${commit_message_parts[0]}
  version=v$(cat VERSION.txt)
  previous_version=$(git tag|tail -n1)
  changes=$(git log --merges --oneline $previous_version..$version)
  echo Commit:\ \ \ $commit
  echo Version:\ \ $version
  echo Previous:\ $previous_version
  echo "================================================================================"
  echo "CHANGES:"
  echo $changes
  echo "================================================================================"
  git tag -a v$version -m "Release version $version

Includes:
$changes"
  echo "New tag created!"
  echo "--------------------------------------------------------------------------------"
else
  echo "No version bump found"
fi
