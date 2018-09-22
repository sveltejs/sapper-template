import db from '../../app/auth/db'
import emailRegex from './_email-regex'


export async function post(req, res) {
	let message = '';
	res.writeHead(200, { 'Content-Type': 'application/json' });
	try {
		if (req.body.key === 'username') {
			debugger
			const found = db.find(req.body.key, req.body.value);
			if (found) {
				message = 'That username is already in use.';
			}
			res.end(JSON.stringify({ valid: !found, message }));
		} else if (req.body.key === 'email') {
			let valid = emailRegex.test(req.body.value);
			if (!valid) {
				message = 'Email is invalid.';
			} else {
				debugger
				const found = db.find(req.body.key, req.body.value);
				if (found) {
					message = 'Email is already taken.';
					valid = false;
				}
			}
			res.end(JSON.stringify({ valid, message }));
		}
		res.end({ valid: false, message: 'Something went wrong. Please <a href="/contact">contact us</a> for help.' });
	} catch (error) {
		res.end({ valid: false, message: 'Something went wrong. Please <a href="/contact">contact us</a> for help.' });
	}
};
