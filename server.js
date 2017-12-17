const fs = require('fs');
const app = require('express')();
const compression = require('compression');
const sapper = require('sapper');
const static = require('serve-static');

const { PORT = 3000 } = process.env;

const fetch = require('node-fetch');
global.fetch = (url, opts) => {
	if (url[0] === '/') url = `http://localhost:${PORT}${url}`;
	return fetch(url, opts);
};

app.use(compression({ threshold: 0 }));

app.use(static('assets'));

app.use(sapper({
	selector: '#sapper'
}));

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});