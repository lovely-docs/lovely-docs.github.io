## Load Functions

Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`:

```js
// Universal (server + browser)
export function load({ params }) {
	return { data: 'value' };
}

// Server-only
export async function load({ params }) {
	return { data: await db.query() };
}
```

## Universal vs Server

- **Universal**: Run on server (SSR) then browser. Can return non-serializable data.
- **Server**: Run only on server. Must return serializable data. Use for DB/secrets.

## Key Features

- **Layout data**: Available to child layouts and pages
- **URL data**: Access `url`, `route`, `params`
- **Fetch**: Use provided `fetch()` (inherits cookies, allows relative URLs)
- **Cookies**: Server load can access/set via `cookies.get/set()`
- **Headers**: Set response headers with `setHeaders()`
- **Parent data**: Access parent load data with `await parent()`
- **Errors/Redirects**: Use `error()` and `redirect()` helpers
- **Streaming**: Return unresolved promises from server load
- **Rerun**: Triggered by param/url changes or `invalidate()`
- **Auth**: Use `getRequestEvent()` in shared auth functions