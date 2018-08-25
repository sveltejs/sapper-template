import loadz0r from 'rollup-plugin-loadz0r';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/rollup.js';
import pkg from '../package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const prod = !dev;

export default {
	input: config.client.input(),
	output: config.client.output(),
	plugins: [
		loadz0r({ publicPath: 'client' }),
		resolve(),
		replace({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
		commonjs(),
		svelte({
			dev,
			hydratable: true
		}),

		prod && terser()
	],
	external: Object.keys(pkg.dependencies).concat(
		require('module').builtinModules
	),
	experimentalCodeSplitting: true
};