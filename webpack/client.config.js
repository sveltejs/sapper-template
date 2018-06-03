const webpack = require('webpack');
const config = require('sapper/webpack/config.js');
const { compileSASS, compileCoffeeScript } = require('./preprocessors');

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
                        preprocess: {
                            style: ({ content, attributes }) => {
                                if(attributes.type !== 'text/scss') return;
                                return compileSASS(content)
                            },
                            script: ({ content, attributes }) => {
                                if(attributes.type !== 'text/coffeescript') return;
                                return compileCoffeeScript(content)
                            }
                        }
					}
				}
			}
		]
	},
	mode,
	plugins: [
		isDev && new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.browser': true,
			'process.env.NODE_ENV': JSON.stringify(mode)
		}),
	].filter(Boolean),
	devtool: isDev && 'inline-source-map'
};
