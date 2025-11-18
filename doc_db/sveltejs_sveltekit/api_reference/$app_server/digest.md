## command
Creates a remote command that executes on the server when called from the browser via fetch. Supports optional validation with schemas or 'unchecked' mode.

## form
Creates a form object for spreading onto `<form>` elements. Supports optional validation and returns form data or invalid state to the handler function.

## getRequestEvent
Returns the current `RequestEvent` for use in server hooks, server load functions, actions, and endpoints. Must be called synchronously in environments without AsyncLocalStorage.

## prerender
Creates a remote prerender function that executes on the server. Accepts optional validation schema and options for `inputs` generator and `dynamic` flag.

## query
Creates a remote query that executes on the server when called from the browser. Supports optional validation with schemas or 'unchecked' mode.

### query.batch
Collects multiple query calls and executes them in a single request. Available since 2.35.

## read
Reads imported asset contents from the filesystem:
```js
import { read } from '$app/server';
import somefile from './somefile.txt';
const asset = read(somefile);
const text = await asset.text();
```