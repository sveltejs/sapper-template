// WARNING: THIS HELPER FILE IS NOT GOOD PRACTICE AND ONLY HERE FOR CONVENIENCE
// use a real database for persisting users instead

// const Users = [{
// 	username: 'general-zod',
// 	email: 'general.zod@krypton.com',
// 	hash: '',
// }, {
// 	username: 'kal-el',
// 	email: 'kal-el@krypton.com',
// 	hash: '',
// }];
const Users = [];

export default {
	find(key, value) {
		return Users.find(user => user[key] === value);
	},
	add(user) {
		Users.push(user);
		return user;
	},
};
