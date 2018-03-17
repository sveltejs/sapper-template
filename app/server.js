import { resolve } from 'url';
import polka from 'polka';
import compression from 'compression';
import sapper from 'sapper';
import serve from 'serve-static';
import fetch from 'node-fetch';
import { routes } from './manifest/server.js';

const { PORT } = process.env;

// this allows us to do e.g. `fetch('/api/blog-posts')` on the server
global.fetch = (url, opts) => {
	url = resolve(`http://localhost:${PORT}/`, url);
	return fetch(url, opts);
};

polka()
	.use(compression({ threshold: 0 }))
	.use(serve('assets'), sapper({ routes }))
	.listen(PORT);