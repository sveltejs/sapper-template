import * as sapper from '@sapper/app';

window.addEventListener('load', () => {
	sapper.start({
		target: document.querySelector('#sapper')
	});
});
