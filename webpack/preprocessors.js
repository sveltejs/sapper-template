const sass = require('node-sass');
const CoffeeScript = require('coffeescript')

const compileSASS = data => new Promise((fulfil, reject) =>
	sass.render({
		data,
		includePaths: ['routes'],
		sourceMap: true,
		outFile: 'x'
	}, (err, result) => {
		if(err) return reject(err);
		fulfil({
			code: result.css.toString(),
			map: result.map.toString()
		})
	}))

const compileCoffeeScript = data => new Promise((res, rej) => {
	try {
		const { js, sourceMap } = CoffeeScript.compile(data, {
			sourceMap: true,
			bare: true
		})

		if(!js || !sourceMap) {
			return rej('error compiling coffeescript');
		}

		return res({
			code: js,
			map: sourceMap
		})
	} catch(e) {
		return rej(e);
	}
})

module.exports = {
	compileSASS,
	compileCoffeeScript
}
