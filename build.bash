#!/usr/bin/env bash

set -e
PATH="$PATH:./node_modules/.bin/"

mkcp() {
  for file in "$@"
  do
    dir="_site/$(dirname "$file")"
    mkdir -p "$dir" && cp "$file" "$dir"
  done
}

printf "%-20s: Create _site dir if not present\n" "Create"
mkdir -p _site

printf "%-20s: Copy the files to _site dir\n" "Copy"
mkcp *.{css,html} scripts/*.js components/*.html

printf "%-20s: Copy the polyfill\n" "Copy"
mkcp bower_components/webcomponentsjs/webcomponents-lite.min.js

printf "%-20s: Copy the pngs in credit card\n" "Copy"
mkcp bower_components/t-creditcard/**/*.png
mkcp bower_components/t-creditcard/*.png

printf "%-20s: Run the build step\n" "Vulcanize"
vulcanize --inline-script --inline-css --strip-comments elements.html | \
crisper --script-in-head=false --html _site/elements.html --js _site/build.js

if [[ "$1" == "--deploy" ]]
then
    printf "%-20s: Remove _publish dir\n" "Cleanup"
    [[ -d "_publish" ]] && rm -rf "_publish"

    printf "%-20s: Clone the demos repository and checkout gh-pages\n" "Clone"
    remote="$(git remote show origin | sed -rn 's/^\s*Fetch URL: (.*)$/\1/p')"
    git clone --branch=gh-pages --depth=1 "$remote" _publish && cd _publish

    printf "%-20s: Copy the build artifacts from _site dir\n" "Copy"
    cp -r ../_site/* ./

    printf "%-20s: Add files, commit and push\n" "Push"
    git add .
    git commit -m "Deploy"
    git push origin gh-pages
    cd ../
fi

