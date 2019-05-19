---
title: What is Sapper?
pubdate: 2018-07-22
---

First, you have to know what [Svelte](https://svelte.dev) is. Svelte is a UI framework with a bold new idea: rather than providing a library that you write code with (like React or Vue, for example), it's a compiler that turns your components into highly optimized vanilla JavaScript. If you haven't already read the [introductory blog post](https://svelte.dev/blog/frameworks-without-the-framework), you should!

Sapper is a Next.js-style framework ([more on that here](blog/how-is-sapper-different-from-next)) built around Svelte. It makes it embarrassingly easy to create extremely high performance web apps. Out of the box, you get:

* Code-splitting, dynamic imports and hot module replacement, powered by webpack
* Server-side rendering (SSR) with client-side hydration
* Service worker for offline support, and all the PWA bells and whistles
* The nicest development experience you've ever had, or your money back

It's implemented as Express middleware. Everything is set up and waiting for you to get started, but you keep complete control over the server, service worker, webpack config and everything else, so it's as flexible as you need it to be.