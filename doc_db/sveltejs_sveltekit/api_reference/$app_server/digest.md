## Overview
The `$app/server` module provides utilities for server-side operations in SvelteKit, including remote function creation and asset reading.

## command (since 2.27)
Creates a remote command that executes on the server when called from the browser via fetch.

```js
import { command } from '$app/server';

// No input
const cmd1 = command(() => 'result');

// Unchecked input
const cmd2 = command('unchecked', (arg) => arg.toUpperCase());

// Schema-validated input
const cmd3 = command(mySchema, (arg) => processData(arg));
```

## form (since 2.27)
Creates a form object spreadable onto `<form>` elements for server-side form handling.

```js
import { form } from '$app/server';

// No input
const f1 = form((invalid) => ({ success: true }));

// Unchecked input
const f2 = form('unchecked', (data, invalid) => handleForm(data));

// Schema-validated input
const f3 = form(mySchema, (data, invalid) => processForm(data));
```

## getRequestEvent (since 2.20.0)
Returns the current `RequestEvent`. Usable in server hooks, server `load` functions, actions, and endpoints. Must be called synchronously in environments without `AsyncLocalStorage` (before any `await`).

```js
import { getRequestEvent } from '$app/server';
const event = getRequestEvent();
```

## prerender (since 2.27)
Creates a remote prerender function for server-side execution during build time.

```js
import { prerender } from '$app/server';

// No input
const p1 = prerender(() => generatePage());

// Unchecked input with options
const p2 = prerender('unchecked', (arg) => renderPage(arg), {
  inputs: function* () { yield 'page1'; yield 'page2'; },
  dynamic: true
});

// Schema-validated
const p3 = prerender(mySchema, (arg) => renderPage(arg), { dynamic: false });
```

## query (since 2.27)
Creates a remote query that executes on the server when called from the browser.

```js
import { query } from '$app/server';

// No input
const q1 = query(() => fetchData());

// Unchecked input
const q2 = query('unchecked', (arg) => searchData(arg));

// Schema-validated
const q3 = query(mySchema, (arg) => queryData(arg));
```

### query.batch (since 2.35)
Batches multiple query calls into a single request.

```js
// Unchecked
const bq1 = query.batch('unchecked', (args) => (arg, idx) => processItem(arg));

// Schema-validated
const bq2 = query.batch(mySchema, (args) => (arg, idx) => processItem(arg));
```

## read (since 2.4.0)
Reads the contents of an imported asset from the filesystem, returning a Response object.

```js
import { read } from '$app/server';
import somefile from './somefile.txt';

const asset = read(somefile);
const text = await asset.text();
```