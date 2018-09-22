import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

// WARNING: use a database instead of persistent memory to store users
// THE FOLLOWING IS BAD PRACTICE AND WILL NOT SCALE!!!
// It's only here for convenience.
import db from './db';

const env = process.env.NODE_ENV;

export function authSetup(app) {

	passport.use(new LocalStrategy(async(username, password, done) => {
		try {
			const user = db.find('username', username);
			if (user) {
				const match = await bcrypt.compare(password, user.hash);
				if (!match) {
					return done(null, false, { message: `${user.username} is not authentic to that password.` });
				}
				done(null, { username: user.username, email: user.email });
			} else {
				return done(null, false, { message: `${username} does not exist.` });
			}
		} catch (error) {
			done(error);
		}
	}));

	app.use(passport.initialize());

	app.post('/auth/signup', async(req, res, next) => {
		try {
			const { username, email, password } = req.body;

			const userExists = db.find('username', username);
			const emailExists = db.find('email', email);

			if (userExists || emailExists) {
				res.end(JSON.stringify({ userExists: !!userExists, emailExists: !!emailExists }));
			}

			const user = db.add({
				username,
				email,
				hash: await bcrypt.hash(password, 10),
			});
			const userToSendToClient = { username: user.username, email: user.email };

			// generate a signed son web token with the contents of user object and return it in the response
			const month = 60 * 60 * 24 * 30;
			const token = jwt.sign(userToSendToClient, config.JWT_SECRET, { expiresIn: month });
			res.cookie('ds', token, {
				// httpOnly: false,
				secure: env === 'production' ? true : false,
				maxAge: 1000 * month,
			});
			res.status(200).send({ userToSendToClient });
		} catch (error) {
			res.status(400).send({ error: 'req body should take the form { username, password }' });
		}
	});

	app.post('/auth/local/login', (req, res) => {
		passport.authenticate('local', { session: false, successRedirect: '/', failureRedirect: '/login' }, (err, user) => {
			if (err || !user) {
				return res.status(400).json({
					message: 'Something went wrong.',
					user: user ? user : false,
				});
			}
			req.login(user, { session: false }, error => {
				if (error) {
					res.send(error);
				}
				// generate a signed son web token with the contents of user object and return it in the response
				const month = 60 * 60 * 24 * 30;
				const token = jwt.sign(user, config.JWT_SECRET, { expiresIn: month });
				return res.cookie('ds', token, {
					// httpOnly: false,
					secure: env === 'production' ? true : false,
					maxAge: 1000 * month,
				}).json(user);
			})
		})(req, res);
	});

	app.post('/auth/logout', (req, res) => {
		req.logout();
		res.end('ok');
	});

}
