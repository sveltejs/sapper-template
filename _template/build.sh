#!/bin/bash
cd "$(dirname $0)"/..

# write out SSH key
[ "$SSH_KEY" ] || exit 1
echo "$SSH_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# branch names
DEFAULT=master
ROLLUP=rollup
WEBPACK=webpack

./create-branches.sh $DEFAULT $ROLLUP $WEBPACK

# force push rollup and webpack branches
git push git@github.com:sveltejs/sapper-template.git $ROLLUP $WEBPACK -f
