import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

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
		!dev && terser()
	]
};
