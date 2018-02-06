const webpack = require('webpack');
const config = require('sapper/webpack/config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isDev = config.dev;

module.exports = {
	entry: config.client.entry(),
	output: config.client.output(),
	resolve: {
		extensions: ['.js', '.html']
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
						emitCss: !isDev,
						cascade: false,
						store: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader', options: { sourceMap:isDev } }
				]
			}
		].filter(Boolean)
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			minChunks: 2,
			async: false,
			children: true
		})
	].concat(isDev ? [
		new webpack.HotModuleReplacementPlugin()
	] : [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new UglifyJSPlugin()
	]).filter(Boolean),
	devtool: isDev && 'inline-source-map'
};
