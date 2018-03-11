import posts from './_posts.js';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const lookup = new Map();
posts.forEach(post => {
	lookup.set(post.slug, JSON.stringify(post));
});

export function get(req, res, next) {
	// the `slug` parameter is available because this file
	// is called [slug].json.js
	const { slug } = req.params;

	if (lookup.has(slug)) {
		res.set({
			'Content-Type': 'application/json',
			'Cache-Control': `public, max-age=${ONE_YEAR_IN_SECONDS}`
		});

		res.end(lookup.get(slug));
	} else {
		next();
	}
}
