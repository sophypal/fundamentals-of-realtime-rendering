#!/bin/bash

TMP_DEMO_DIR=.gh-pages

ember build -e gh-pages
git clone git@github.com:sophypal/fundamentals-of-realtime-rendering.git ${TMP_DEMO_DIR} > /dev/null 2>&1
cd ${TMP_DEMO_DIR}
git checkout gh-pages
git rm -rf *
cp -r ../dist/* .
git add --all
git commit -m "gh-pages publish"
git push origin gh-pages > /dev/null 2>&1