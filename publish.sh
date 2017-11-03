#!/usr/bin/env bash

SHA=$(git rev-parse --verify HEAD)

git checkout master
bundle exec jekyll build
rm -r _*
rm about.html Gemfile* _config.yml about.html archive.html
yes | cp -r _site/* ./
git add .
git commit -m "Publish ${SHA}"
git push origin master
git checkout source
