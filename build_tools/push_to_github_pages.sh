current_branch=$(git rev-parse --abbrev-ref HEAD)
destination_branch=gh-pages
echo "================================================================================"
echo "Pushing documentation to Github Pages from" $(git rev-parse --abbrev-ref HEAD)
echo "--------------------------------------------------------------------------------"
if [ $(ls ./pages | grep ".html" | wc -l) -eq 0 ]; then
  echo "ERROR: You need to generate the static pages first\nUse python build_tools/publish-gh-page.py\n"; exit
else
  echo "Static pages found in ./pages"
fi
if [ $(git status --porcelain | wc -l) -gt 0 ]; then
  echo "ERROR: You have uncommitted changes which would be lost by running this script"; exit
fi
echo
echo "--------------------------------------------------------------------------------"
echo "Deleting stuff that isn't needed for Github Pages"
echo "--------------------------------------------------------------------------------"
find . | grep -v "pages" | grep -v ".git" | xargs rm -rf
mv pages/* ./
rm -r pages
echo "--------------------------------------------------------------------------------"
echo "Deleting gh-pages branch and creating a clean version"
echo "--------------------------------------------------------------------------------"
git branch -D $destination_branch
git checkout -b $destination_branch
git add .
git commit -am "Generate toolkit documentation"
echo "--------------------------------------------------------------------------------"
echo "Force pushing to origin/$destination_branch"
echo "--------------------------------------------------------------------------------"
git push -f origin $destination_branch
echo "--------------------------------------------------------------------------------"
echo "Returning you to $current_branch"
echo "--------------------------------------------------------------------------------"
git checkout -f $current_branch
