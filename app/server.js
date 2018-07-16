import sirv from 'sirv';
import polka from 'polka';
import sapper from 'sapper';
import compression from 'compression';
import { routes } from './manifest/server.js';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('assets'),
		sapper({ routes })
	)
	.listen(process.env.PORT)
	.catch(err => {
		console.log('error', err);
	})
