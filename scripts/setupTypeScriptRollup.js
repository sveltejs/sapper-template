// @ts-check
const fs = require('fs');
const path = require('path');
const { argv } = require('process');

const projectRoot = argv[2] || path.join(__dirname, '..');

console.log('Adding TypeScript with Rollup');

// Add deps to pkg.json
const pkgJSONPath = path.join(projectRoot, 'package.json');
const packageJSON = JSON.parse(fs.readFileSync(pkgJSONPath, 'utf8'));
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies, {
	'@rollup/plugin-typescript': '^6.0.0',
	'@tsconfig/svelte': '^1.0.10',
	'@types/compression': '^1.7.0',
	'@types/node': '^14.11.1',
	'@types/polka': '^0.5.1',
	'svelte-check': '^1.0.46',
	'svelte-preprocess': '^4.3.0',
	'tslib': '^2.0.1',
	'typescript': '^4.0.3'
});

// Add script for checking
packageJSON.scripts = Object.assign(packageJSON.scripts, {
	validate: 'svelte-check --ignore src/node_modules/@sapper'
});

// Write the package JSON
fs.writeFileSync(pkgJSONPath, JSON.stringify(packageJSON, null, '  '));

scanFolderAndReplace(path.join(projectRoot, 'src'));

// replace js filenames to ts
function scanFolderAndReplace(dir) {
	const elements = fs.readdirSync(dir, { withFileTypes: true });

	for (let i = 0; i < elements.length; i++) {
		if (elements[i].isDirectory()) {
			scanFolderAndReplace(path.join(dir, elements[i].name));
		} else if (elements[i].name.match(/^((?!json).)*js$/)) {
			fs.renameSync(
				path.join(dir, elements[i].name),
				path.join(dir, elements[i].name).replace('.js', '.ts')
			);
		}
	}
}

// Switch the *.svelte file to use TS
[
	{
		view: 'components/Nav',
		vars: [{ name: 'segment', type: 'string' }]
	},
	{
		view: 'routes/index'
	},
	{
		view: 'routes/about'
	},
	{
		view: 'routes/_layout',
		vars: [{ name: 'segment', type: 'string' }]
	},
	{
		view: 'routes/_error',
		vars: [
			{ name: 'status', type: 'number' },
			{ name: 'error', type: 'Error' }
		]
	},
	{
		view: 'routes/blog/index',
		vars: [
			{ name: 'posts', type: '{ slug: string; title: string, html: any }[]' }
		],
		contextModule: [
			{
				js: '.then(r => r.json())',
				ts: '.then((r: { json: () => any; }) => r.json())'
			},
			{
				js: '.then(posts => {',
				ts: '.then((posts: { slug: string; title: string, html: any }[]) => {'
			}
		]
	},
	{
		view: 'routes/blog/[slug]',
		vars: [{ name: 'post', type: '{ slug: string; title: string, html: any }' }]
	}
].forEach(({ view, vars, contextModule }) => {
	const svelteFilePath = path.join(projectRoot, 'src', `${view}.svelte`);
	let file = fs.readFileSync(svelteFilePath, 'utf8');

	file = file.replace(/(?:<script)(( .*?)*?)>/gm, '<script$1 lang="ts">');

	if (vars) {
		vars.forEach(({ name, type }) => {
			file = file.replace(
				`export let ${name};`,
				`export let ${name}: ${type};`
			);
		});
	}

	if (contextModule) {
		contextModule.forEach(({ js, ts }) => {
			file = file.replace(`${js}`, `${ts}`);
		});
	}

	fs.writeFileSync(svelteFilePath, file);
});

// Edit rollup config
const rollupConfigPath = path.join(projectRoot, 'rollup.config.js');
let rollupConfig = fs.readFileSync(rollupConfigPath, 'utf8');

// Edit imports
rollupConfig = rollupConfig.replace(
	`'rollup-plugin-terser';`,
	`'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';`
);

// Edit inputs
rollupConfig = rollupConfig.replace(
	`onwarn(warning);`,
	`(warning.code === 'THIS_IS_UNDEFINED') ||\n\tonwarn(warning);`
);
rollupConfig = rollupConfig.replace(
	`input: config.client.input(),`,
	`input: config.client.input().replace(/\.js$/, '.ts'),`
);
rollupConfig = rollupConfig.replace(
	`input: config.server.input(),`,
	`input: { server: config.server.input().server.replace(/\.js$/, ".ts") },`
);
rollupConfig = rollupConfig.replace(
	`input: config.serviceworker.input(),`,
	`input: config.serviceworker.input().replace(/\.js$/, '.ts'),`
);

// Add preprocess to the svelte config, this is tricky because there's no easy signifier.
// Instead we look for 'hydratable: true,'
rollupConfig = rollupConfig.replace(
	new RegExp('hydratable: true,', 'g'),
	'hydratable: true,\n\t\t\t\tpreprocess: sveltePreprocess(),'
);

// Edit service worker
const serviceWorkerConfigPath = path.join(
	projectRoot,
	'src',
	'service-worker.ts'
);

let serviceWorkerConfig = fs.readFileSync(serviceWorkerConfigPath, 'utf8');

serviceWorkerConfig = serviceWorkerConfig.replace(
	`shell.concat(files);`,
	`(shell as string[]).concat(files as string[]);`
);

serviceWorkerConfig = serviceWorkerConfig.replace(
	`'install', event =>`,
	`'install', <EventType extends ExtendableEvent>(event: EventType) =>`
);

serviceWorkerConfig = serviceWorkerConfig.replace(
	`self.skipWaiting();`,
	`((self as any) as ServiceWorkerGlobalScope).skipWaiting();`
);

serviceWorkerConfig = serviceWorkerConfig.replace(
	`'activate', event =>`,
	`'activate', <EventType extends ExtendableEvent>(event: EventType) =>`
);

serviceWorkerConfig = serviceWorkerConfig.replace(
	`self.clients.claim();`,
	`((self as any) as ServiceWorkerGlobalScope).clients.claim();`
);

serviceWorkerConfig = serviceWorkerConfig.replace(
	`'fetch', event =>`,
	`'fetch', <EventType extends FetchEvent>(event: EventType) =>`
);

fs.writeFileSync(serviceWorkerConfigPath, serviceWorkerConfig);

// Add TypeScript
rollupConfig = rollupConfig.replace(
	/commonjs\(\),?/g,
	'commonjs(),\n\t\t\ttypescript({ sourceMap: dev }),'
);

// Save rollup config
fs.writeFileSync(rollupConfigPath, rollupConfig);

// Add TSConfig
const tsconfig = `{
	"extends": "@tsconfig/svelte/tsconfig.json",
	"compilerOptions": {
		"lib": ["DOM", "ES2017", "WebWorker"]
	},
	"include": ["src/**/*", "src/node_modules/**/*"],
	"exclude": ["node_modules/*", "__sapper__/*", "static/*"]
}`;
const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
fs.writeFileSync(tsconfigPath, tsconfig);

// Delete this script, but not during testing
if (!argv[2]) {
	// Remove the script
	fs.unlinkSync(path.join(__filename));

	// Check for Mac's DS_store file, and if it's the only one left remove it
	const remainingFiles = fs.readdirSync(path.join(__dirname));
	if (remainingFiles.length === 1 && remainingFiles[0] === '.DS_store') {
		fs.unlinkSync(path.join(__dirname, '.DS_store'));
	}

	// Check if the scripts folder is empty
	if (fs.readdirSync(path.join(__dirname)).length === 0) {
		// Remove the scripts folder
		fs.rmdirSync(path.join(__dirname));
	}
}

// Adds the extension recommendation
fs.mkdirSync(path.join(projectRoot, '.vscode'));
fs.writeFileSync(
	path.join(projectRoot, '.vscode', 'extensions.json'),
	`{"recommendations": ["svelte.svelte-vscode"]}`
);

console.log('Converted to TypeScript.');

if (fs.existsSync(path.join(projectRoot, 'node_modules'))) {
	console.log(`\nYou will need to re-run 'npm install' to get started.`);
}
