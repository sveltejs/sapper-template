const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = require('sapper/webpack/config.js');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';

module.exports = {
	entry: config.client.entry(),
	output: config.client.output(),
	resolve: {
		extensions: ['.js', '.json', '.html'],
		mainFields: ['svelte', 'module', 'browser', 'main']
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: {
					loader: 'svelte-loader',
					options: {
						dev: isDev,
						hydratable: true,
						hotReload: true,
						emitCss: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					"css-loader"
				]
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		isDev && new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
	].filter(Boolean),
	devtool: isDev && 'inline-source-map'
};
