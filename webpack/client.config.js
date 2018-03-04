const webpack = require('webpack');
const config = require('sapper/webpack/config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

module.exports = {
	entry: config.client.entry(),
	output: config.client.output(),
	resolve: {
		extensions: ['.js', '.json', '.html']
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						hydratable: true,
						cascade: false,
						store: true
					}
				}
			}
		]
	},
	mode,
	plugins: [
		isDev && new webpack.HotModuleReplacementPlugin()
	].filter(Boolean),
	devtool: isDev && 'inline-source-map'
};
