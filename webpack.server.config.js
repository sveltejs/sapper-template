const config = require('sapper/webpack/config.js');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: config.server.entry(),
	output: config.server.output(),
	target: 'node',
	resolve: {
		extensions: ['.js', '.html', '.ts']
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						css: false,
						cascade: false,
						store: true,
						generate: 'ssr'
					}
				}
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	}
};