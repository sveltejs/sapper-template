import * as eases from 'eases-jsnext';
import * as yootils from 'yootils';

export default function move({ fallback }) {
	let requested = new Map();
	let provided = new Map();

	function move(from, node) {
		const to = node.getBoundingClientRect();
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const dsx = (from.right - from.left) / (to.right - to.left);
		const dsy = (from.bottom - from.top) / (to.bottom - to.top);

		const sx = yootils.linearScale([0, 1], [dsx, 1]);
		const sy = yootils.linearScale([0, 1], [dsy, 1]);

		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 400,
			easing: eases.quintOut,
			css: (t, u) => `
				transform-origin: 0 0;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${sx(t)}, ${sy(t)});
			`
		};
	}

	return {
		send(node, params) {
			provided.set(params.key, {
				rect: node.getBoundingClientRect()
			});

			return () => {
				if (requested.has(params.key)) {
					const { rect } = requested.get(params.key);
					requested.delete(params.key);

					return {
						duration: 0,
						css: () => `opacity: 0`
					};
				}

				// if the node is disappearing altogether
				// (i.e. wasn't claimed by the other list)
				// then we need to supply an outro
				provided.delete(params.key);
				return fallback(node, params);
			};
		},

		receive(node, params) {
			requested.set(params.key, {
				rect: node.getBoundingClientRect()
			});

			return () => {
				if (provided.has(params.key)) {
					const { rect } = provided.get(params.key);
					provided.delete(params.key);

					return move(rect, node);
				}

				requested.delete(params.key);
				return fallback(node, params);
			};
		}
	};
}