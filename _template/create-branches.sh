#!/bin/bash
cd "$(dirname $0)"/..

DEFAULT=${1:-master}
ROLLUP=${2:-rollup}
WEBPACK=${3:-webpack}

echo "Creating $ROLLUP and $WEBPACK branches from $DEFAULT"

# make sure we're on master, and delete the $ROLLUP and $WEBPACK branches
git symbolic-ref HEAD "refs/heads/$DEFAULT"
git reset --hard
git branch -D $ROLLUP $WEBPACK

# create the $ROLLUP branch off the current master
git checkout -b $ROLLUP
node _template/build-pkg.js rollup
git rm -r --cached .travis.yml _template package_template.json webpack.config.js
git add package.json
git commit -m 'Sapper template for Rollup'
git symbolic-ref HEAD "refs/heads/$DEFAULT"
git reset --hard

# create the $WEBPACK branch off the current master
git checkout -b $WEBPACK
node _template/build-pkg.js webpack
git rm -r --cached .travis.yml _template package_template.json rollup.config.js
git add package.json
git commit -m 'Sapper template for webpack'
git symbolic-ref HEAD "refs/heads/$DEFAULT"
git reset --hard