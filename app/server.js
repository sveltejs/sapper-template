import fs from 'fs';
import express from 'express';
import compression from 'compression';
import sapper from 'sapper';
import serve from 'serve-static';
import fetch from 'node-fetch';
import { routes } from './manifest/server.js';

const app = express();

const { PORT = 3000 } = process.env;

// this allows us to do e.g. `fetch('/api/blog-posts')` on the server
global.fetch = (url, opts) => {
	if (url[0] === '/') url = `http://localhost:${PORT}${url}`;
	return fetch(url, opts);
};

app.use(compression({ threshold: 0 }));

app.use(serve('assets'));

app.use(sapper({
	routes
}));

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});