## Navigation Functions

**afterNavigate(callback)** - Lifecycle function that runs when component mounts and on every navigation. Must be called during component initialization, remains active while mounted.

**beforeNavigate(callback)** - Navigation interceptor that triggers before navigation (link clicks, `goto()`, browser back/forward). Call `cancel()` to prevent navigation. For 'leave' type navigations (user leaving app), `cancel()` triggers browser unload dialog. `navigation.to.route.id` is `null` for non-SvelteKit routes. `navigation.willUnload` is `true` if navigation will unload document. Must be called during component initialization.

**disableScrollHandling()** - Disables SvelteKit's built-in scroll handling when called during page update (in `onMount`, `afterNavigate`, or actions). Generally discouraged as it breaks user expectations.

**goto(url, opts?)** - Programmatic navigation to given route. Returns Promise that resolves when navigation completes or rejects on failure. For external URLs use `window.location = url` instead. Options: `replaceState` (boolean), `noScroll` (boolean), `keepFocus` (boolean), `invalidateAll` (boolean), `invalidate` (array of strings/URLs/predicates), `state` (App.PageState).

**invalidate(resource)** - Re-runs `load` functions for currently active page if they depend on the given resource via `fetch` or `depends`. Argument can be string/URL (must match exactly) or function predicate. Returns Promise resolving when page updates.
```ts
invalidate((url) => url.pathname === '/path'); // Match '/path' regardless of query params
```

**invalidateAll()** - Re-runs all `load` functions for currently active page. Returns Promise resolving when page updates.

**onNavigate(callback)** - Lifecycle function running immediately before navigation to new URL (except full-page navigations). If callback returns Promise, SvelteKit waits before completing navigation (useful for `document.startViewTransition`). If callback returns function, it's called after DOM updates. Must be called during component initialization.

**preloadCode(pathname)** - Programmatically imports code for routes not yet fetched. Specify routes by pathname like `/about` or `/blog/*`. Doesn't call `load` functions. Returns Promise resolving when modules imported.

**preloadData(href)** - Preloads given page: ensures code is loaded and calls page's `load` function. Same behavior as SvelteKit triggers on `<a data-sveltekit-preload-data>`. If next navigation is to `href`, returned values are used making navigation instantaneous. Returns Promise resolving with `{type: 'loaded', status, data}` or `{type: 'redirect', location}`.

**pushState(url, state)** - Programmatically create new history entry with given `page.state`. Pass `''` as url to use current URL. Used for shallow routing.

**refreshAll(opts?)** - Re-runs all currently active remote functions and all `load` functions for currently active page (unless disabled via `includeLoadFunctions` option). Returns Promise resolving when page updates.

**replaceState(url, state)** - Programmatically replace current history entry with given `page.state`. Pass `''` as url to use current URL. Used for shallow routing.