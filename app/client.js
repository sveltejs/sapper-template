import { init } from 'sapper/runtime.js';
import { manifest } from './manifest/client.js';
import { Store } from 'svelte/store.js'

init({
	target: document.querySelector('#sapper'),
	manifest,
	store: data => {
		const user = data.user;
		const store = new Store(data);
		if (!user) {
			// SEE: https://stackoverflow.com/questions/10593013/delete-cookie-by-name
			document.cookie = 'ds=;expires=Sun, 09 Jan 1974 00:00:01 GMT;';
		}
		store.set({
			logout: () => {
				return fetch('auth/logout', { method: 'POST' }).then(() => {
					// SEE: https://stackoverflow.com/questions/10593013/delete-cookie-by-name
					document.cookie = 'ds=;expires=Sun, 09 Jan 1974 00:00:01 GMT;';
					store.set({ user: null });
					window.location = '/'
				})
			},
		})
		return store
	}
});
