import move from './_move.js';

const { send, receive } = move({
	fallback(node) {
		return {
			duration: 0,
			css: t => `opacity: ${t}`
		};
	}
});

export { send, receive };