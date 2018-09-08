import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

export default {
	input: config.client.input(),
	output: config.client.output(),
	plugins: [
		svelte({
			dev,
			hydratable: true,
			emitCss: true
		}),
		resolve(),
		replace({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
		commonjs(),

		legacy && babel({
			extensions: ['.js', '.html'],
			runtimeHelpers: true,
			exclude: ['node_modules/@babel/**'],
			presets: [
				['@babel/preset-env', {
					targets: '> 0.25%, not dead'
				}]
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				['@babel/plugin-transform-runtime', {
					useESModules: true
				}]
			]
		}),

		!dev && terser({
			module: true
		})
	],

	// temporary, pending Rollup 1.0
	experimentalCodeSplitting: true
};