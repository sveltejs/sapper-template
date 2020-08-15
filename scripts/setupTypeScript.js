// @ts-check

/** This script modifies the project to support TS code in .svelte files like:
  <script lang="ts">
  	export let name: string;
  </script>
 
  As well as validating the code for CI.
  */

/**  To work on this script:
  rm -rf test-template sapper-template && git clone sveltejs/sapper-template test-template && node scripts/setupTypeScript.js test-template
*/

const fs = require("fs")
const path = require("path")
const { argv } = require("process")

const projectRoot = argv[2] || path.join(__dirname, "..")

if(fs.existsSync(path.join(projectRoot, "package.json"))) {

  throw new Error("package.json already created. This script only works on plain new templates!")

}

// Add deps to pkg.json
let pkgJSONPath = path.join(projectRoot, "package_template.json")
const packageJSON = JSON.parse(fs.readFileSync(pkgJSONPath, "utf8"))
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies, {
  "svelte-check": "^1.0.0",
  "svelte-preprocess": "^4.0.0",
  "@rollup/plugin-typescript": "^4.0.0",
  "typescript": "^3.9.3",
  "tslib": "^2.0.0",
  "@tsconfig/svelte": "^1.0.0"
})

// Add script for checking
packageJSON.scripts = Object.assign(packageJSON.scripts, {
  "validate": "svelte-check"
})

// Write the package JSON
fs.writeFileSync(pkgJSONPath, JSON.stringify(packageJSON, null, "  "))

scanFolderAndReplace(path.join(projectRoot, "src"))

// replace js script tags to ts
// replace js filenames to ts
function scanFolderAndReplace (dir) {

  const elements = fs.readdirSync(dir, { withFileTypes: true })

  for(let i = 0; i < elements.length; i++) {

    if(elements[i].isDirectory()) scanFolderAndReplace(path.join(dir, elements[i].name))
    else if(elements[i].name.match(/.svelte/)) {

      let svelteFile = fs.readFileSync(path.join(dir, elements[i].name), "utf8")
      svelteFile = svelteFile.replace("<script", '<script lang="ts"')
      fs.writeFileSync(path.join(dir, elements[i].name), svelteFile)
      
    }else if(elements[i].name.match(/.js/)) fs.renameSync(path.join(dir, elements[i].name), path.join(dir, elements[i].name).replace('.js', '.ts'))

  }

}
