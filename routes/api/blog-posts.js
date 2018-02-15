import posts from 'api/blog/_posts.js';

const contents = JSON.stringify(posts.map(post => {
	return {
		title: post.title,
		slug: post.slug
	};
}));

export function get(req, res) {
	res.set({
		'Content-Type': 'application/json'
	});

	res.end(contents);
}