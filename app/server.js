import fs from 'fs';
import polka from 'polka';
import compression from 'compression';
import sapper from 'sapper';
import serve from 'serve-static';
import fetch from 'node-fetch';
import { routes } from './manifest/server.js';

const { PORT } = process.env;

// this allows us to do e.g. `fetch('/api/blog-posts')` on the server
global.fetch = (url, opts) => {
	if (url[0] === '/') url = `http://localhost:${PORT}${url}`;
	return fetch(url, opts);
};

// you can also use Express
polka()
	.use(compression({ threshold: 0 }))
	.use(serve('assets'))
	.use(sapper({ routes }))
	.listen(PORT);
