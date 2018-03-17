import { resolve } from 'url';
import express from 'express';
import compression from 'compression';
import sapper from 'sapper';
import serve from 'serve-static';
import fetch from 'node-fetch';
import { basepath, routes } from './manifest/server.js';

const { PORT } = process.env;

// this allows us to do e.g. `fetch('/api/blog-posts')` on the server
global.fetch = (url, opts) => {
	url = resolve(`http://localhost:${PORT}${basepath}/`, url);
	return fetch(url, opts);
};

express()
	.use(compression({ threshold: 0 }))
	.use(basepath, serve('assets'))
	.use(sapper({ routes }))
	.listen(PORT);