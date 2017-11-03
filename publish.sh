#!/usr/bin/env bash
set -e

SHA=$(git rev-parse --verify HEAD)

git checkout master
bundle exec jekyll build
yes | cp -r _site/* ./
rm -r _*
rm about.html archive.html
git add .
git commit -m "Publish ${SHA}"
git push origin master
git checkout source
