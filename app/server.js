import sirv from 'sirv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { authSetup } from './auth/setup';
import { authValidate } from './auth/validate';
import sapper from 'sapper';
import compression from 'compression';
import { Store } from 'svelte/store.js';
import { manifest } from './manifest/server.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = express()

app.use(compression({ threshold: 0 }))
app.use(sirv('assets', { dev }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

authSetup(app)

app.use(sapper({
	manifest,
	store: req => {
		const user = authValidate(req);
		return new Store({ user: user.unauthorized ? null : user });
	},
}))

app.listen(PORT, err => {
	if (err) console.log('error', err);
})
