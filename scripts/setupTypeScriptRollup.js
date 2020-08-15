// @ts-check

/** This script modifies the project to support TS code in .svelte files like:
  <script lang="ts">
 
  As well as validating the code for CI.
  */

/**  To work on this script:
  rm -rf test-template sapper-template && git clone sveltejs/sapper-template test-template && node scripts/setupTypeScript.js test-template
*/

const fs = require("fs")
const path = require("path")
const { argv } = require("process")

const projectRoot = argv[2] || path.join(__dirname, "..")

console.log("Adding typescript with rollup")

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
  "@tsconfig/svelte": "^1.0.0",
  "@types/compression": "^1.7.0",
  "@types/node": "^14.0.27",
  "@types/polka": "^0.5.1"
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

// Edit rollup config
const rollupConfigPath = path.join(projectRoot, "rollup.config.js")
let rollupConfig = fs.readFileSync(rollupConfigPath, "utf8")

// Edit imports
rollupConfig = rollupConfig.replace(`'rollup-plugin-terser';`, `'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';`)

// Edit inputs
rollupConfig = rollupConfig.replace(`input: config.client.input(),`, `input: config.client.input().replace(/\.js$/, '.ts'),`)
rollupConfig = rollupConfig.replace(`input: config.server.input(),`, `((typeof config.server.input() === 'string') ? config.server.input() : config.server.input().server).replace(/\.js$/, '.ts'),`)
rollupConfig = rollupConfig.replace(`input: config.serviceworker.input(),`, `input: config.serviceworker.input().replace(/\.js$/, '.ts')`)

// Add preprocess to the svelte config, this is tricky because there's no easy signifier.
// Instead we look for 'hydratable: true,'
rollupConfig = rollupConfig.replace(new RegExp('hydratable: true,', "g"), 'hydratable: true,\npreprocess: sveltePreprocess(),')

// Add TypeScript
rollupConfig = rollupConfig.replace(new RegExp("commonjs(),", "g"), 'commonjs(),\n\t\ttypescript({ sourceMap: dev }),')

// Save rollup config
fs.writeFileSync(rollupConfigPath, rollupConfig)

// Add TSConfig
const tsconfig = `{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"],
}`
const tsconfigPath =  path.join(projectRoot, "tsconfig.json")
fs.writeFileSync(tsconfigPath, tsconfig)

// Delete this script, but not during testing
if (!argv[2]) {
  // Remove the script
  fs.unlinkSync(path.join(__filename))

  // Check for Mac's DS_store file, and if it's the only one left remove it
  const remainingFiles = fs.readdirSync(path.join(__dirname))
  if (remainingFiles.length === 1 && remainingFiles[0] === '.DS_store') {
    fs.unlinkSync(path.join(__dirname, '.DS_store'))
  }

  // Check if the scripts folder is empty
  if (fs.readdirSync(path.join(__dirname)).length === 0) {
    // Remove the scripts folder
    fs.rmdirSync(path.join(__dirname))
  }
}

// Adds the extension recommendation
fs.mkdirSync(path.join(projectRoot, ".vscode"))
fs.writeFileSync(path.join(projectRoot, ".vscode", "extensions.json"), `{
  "recommendations": ["svelte.svelte-vscode"]
}
`)

console.log("Converted to TypeScript.")

if (fs.existsSync(path.join(projectRoot, "node_modules"))) {
  console.log("\nYou will need to re-run your dependency manager to get started.")
}