/**
 * These declarations tell TypeScript that we allow import of images, e.g.
 * ```
		<script lang='ts'>
			import successkid from 'images/successkid.jpg';
		</script>

		<img src="{successkid}">
	 ```
 */
declare module "*.jpg" {
	const value: any;
	export = value;
}

declare module "*.png" {
	const value: any;
	export = value;
}
