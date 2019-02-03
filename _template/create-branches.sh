#!/bin/bash
cd "$(dirname $0)"/..

# make sure we're on master, and delete the rollup-v3 and webpack-v3 branches
git symbolic-ref HEAD refs/heads/master
git reset --hard
git branch -D rollup-v3 webpack-v3

# create the rollup-v3 branch off the current master
git checkout -b rollup-v3
node _template/build-pkg.js rollup
git rm -r --cached .travis.yml _template package_template.json webpack.config.js
git add package.json
git commit -m 'Sapper template for Rollup'
git symbolic-ref HEAD refs/heads/master
git reset --hard

# create the webpack-v3 branch off the current master
git checkout -b webpack-v3
node _template/build-pkg.js webpack
git rm -r --cached .travis.yml _template package_template.json rollup.config.js
git add package.json
git commit -m 'Sapper template for webpack'
git symbolic-ref HEAD refs/heads/master
git reset --hard