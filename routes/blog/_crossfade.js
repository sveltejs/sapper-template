import * as eases from 'eases-jsnext';
import * as yootils from 'yootils';

export default function crossfade({ fallback }) {
	let requested = new Map();
	let provided = new Map();

	function crossfade(from, node) {
		const to = node.getBoundingClientRect();
		console.log({ from, to });
		const dx = from.left - to.left;
		const dy = from.top - to.top;

		const dsx = (from.right - from.left) / (to.right - to.left);
		const dsy = (from.bottom - from.top) / (to.bottom - to.top);

		console.log({ dsx, dsy });

		const sx = yootils.linearScale([0, 1], [dsx, 1]);
		const sy = yootils.linearScale([0, 1], [dsy, 1]);

		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 4000,
			easing: eases.quintOut,
			css: (t, u) => `
				opacity: ${t};
				transform-origin: 0 0;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${sx(t)}, ${sy(t)});
			`,
			tick: (t, u) => {
				// console.log({
				// 	sx: 1 + u * dsx,
				// 	sy: 1 + u * dsy,
				// });
			}
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

					return crossfade(rect, node);
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

					return crossfade(rect, node);
				}

				requested.delete(params.key);
				return fallback(node, params);
			};
		}
	};
}