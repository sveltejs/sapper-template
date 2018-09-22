// WARNING: THIS HELPER FILE IS NOT GOOD PRACTICE AND ONLY HERE FOR CONVENIENCE
// use a real database for persisting users instead

const Users = [{
	username: 'general-zod',
	email: 'general.zod@krypton.com',
	hash: '$2b$10$wP/YQvEX1pC4F1Unnf46ceOR1I6Q.OgOtRNjUT7NxbBDW8vxEEGSK', // the password is `password`
}, {
	username: 'kal-el',
	email: 'kal-el@krypton.com',
	hash: '$2b$10$wP/YQvEX1pC4F1Unnf46ceOR1I6Q.OgOtRNjUT7NxbBDW8vxEEGSK', // the password is `password`
}];

export default {
	find(key, value) {
		return Users.find(user => user[key] === value);
	},
	add(user) {
		Users.push(user);
		return user;
	},
};
