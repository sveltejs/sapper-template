#!/bin/bash
cd "$(dirname "$0")"/..

HEAD=$(git rev-parse HEAD)

ROLLUP=${1:-rollup}
WEBPACK=${2:-webpack}

echo "Creating $ROLLUP and $WEBPACK branches from $REV"

# create the $ROLLUP branch off the current HEAD
git symbolic-ref HEAD refs/heads/$ROLLUP
git reset $HEAD --hard
node _template/build-pkg.js rollup
git rm -r --cached .github _template package_template.json webpack.config.js
git add package.json
git mv scripts/setupTypeScriptRollup.js scripts/setupTypeScript.js
git rm scripts/setupTypeScriptWebpack.js
git commit -m 'Sapper template for Rollup'

# create the $WEBPACK branch off the current HEAD
git symbolic-ref HEAD refs/heads/$WEBPACK
git reset $HEAD --hard
node _template/build-pkg.js webpack
git rm -r --cached .github _template package_template.json rollup.config.js
git add package.json
git mv scripts/setupTypeScriptWebpack.js scripts/setupTypeScript.js
git rm scripts/setupTypeScriptRollup.js
git commit -m 'Sapper template for webpack'
