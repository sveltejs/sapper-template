#!/bin/bash
cd "$(dirname $0)"/..

# write out SSH key
[ "$SSH_KEY" ] || exit 1
echo "$SSH_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# make sure we're on master, and delete the rollup and webpack branches
git symbolic-ref HEAD refs/heads/master
git reset --hard
git branch -D rollup webpack

# create the rollup branch off the current master
git checkout -b rollup
node _template/build-pkg.js rollup
git rm -r --cached .travis.yml _template package_template.json webpack.config.js
git add package.json
git commit -m 'Sapper template for Rollup'
git symbolic-ref HEAD refs/heads/master
git reset --hard

# create the webpack branch off the current master
git checkout -b webpack
node _template/build-pkg.js webpack
git rm -r --cached .travis.yml _template package_template.json rollup.config.js
git add package.json
git commit -m 'Sapper template for webpack'
git symbolic-ref HEAD refs/heads/master
git reset --hard

# force push rollup and webpack branches
git push git@github.com:sveltejs/sapper-template.git rollup webpack -f
