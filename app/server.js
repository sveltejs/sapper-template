import polka from 'polka';
import compression from 'compression';
import sapper from 'sapper';
import serve from 'serve-static';
import { routes } from './manifest/server.js';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		serve('assets'),
		sapper({ routes })
	)
	.listen(process.env.PORT);
