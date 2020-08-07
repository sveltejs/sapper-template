<script>
	import Nav from '../components/Nav.svelte';
	import favicon from 'images/favicon.png';

	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<svelte:head>
	<link rel='icon' type='image/png' href='{favicon}'>
</svelte:head>

<Nav {segment}/>

<main>
	<slot></slot>
</main>