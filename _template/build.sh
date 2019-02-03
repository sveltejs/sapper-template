#!/bin/bash
cd "$(dirname $0)"/..

# write out SSH key
[ "$SSH_KEY" ] || exit 1
echo "$SSH_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

./create-branches.sh

# force push rollup-v3 and webpack branches
git push git@github.com:sveltejs/sapper-template.git rollup-v3 webpack-v3 -f
