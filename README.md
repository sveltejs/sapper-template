# sapper-template-auth

A version of the default Sapper template that shows how auth can be done using [Passport](http://www.passportjs.org/) and [JWT](https://jwt.io/).

*NOTE: this version is forked from the [Rollup branch](https://github.com/sveltejs/sapper-template/tree/rollup)*. Please follow the readme file in that branch for basic setup.

## Auth

In this branch, the `app/server.js` and `app/client.js` files are modified to include setup for authentication. Note that most of the setup takes place in `app/auth/setup.js`.

### Store

The server checks for a user, and if present, pushes it up to the client's store. Likewise, on login/signup, the user (signified as `$user` in HTML) is created and added to the store.

This allows you to do auth-specific HTML such as:

```HTML
{#if $user}
	<Private/>
{:else}
	<Public/>
{/if}
```

### JWT tokens

Please note, there are no back end sessions stored anywhere. Instead, the JWT token is stored on the client in a cookie, which is passed on each request. This can then be validated against a JWT_SECRET variable. In this app, for convenience, that variable is hard coded, but you MUST MAKE IT SECRET, likely as an environment variable.

### Database

Also, for convenience, all data is stored in memory (or hard coded) in `app/auth/db.js`. You should absolutely lose this file and use an actual database to store your users.
