const config = require('sapper/webpack/config.js');
const pkg = require('../package.json');
const { compileSASS, compileCoffeeScript } = require('./preprocessors');

module.exports = {
	entry: config.server.entry(),
	output: config.server.output(),
	target: 'node',
	resolve: {
		extensions: ['.js', '.json', '.html'],
		mainFields: ['svelte', 'module', 'browser', 'main']
	},
	externals: Object.keys(pkg.dependencies),
	module: {
		rules: [
			{
				test: /\.html$/,
				use: {
					loader: 'svelte-loader',
					options: {
						css: false,
						generate: 'ssr',
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
	mode: process.env.NODE_ENV,
	performance: {
		hints: false // it doesn't matter if server.js is large
	}
};