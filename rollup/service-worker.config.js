import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/rollup.js';
import pkg from '../package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const prod = !dev;

export default {
	input: config.serviceworker.input(),
	output: config.serviceworker.output(),
	plugins: [
		resolve(),
		replace({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
		commonjs(),
		prod && terser()
	],
	external: Object.keys(pkg.dependencies).concat(
		require('module').builtinModules
	),
	experimentalCodeSplitting: true
};