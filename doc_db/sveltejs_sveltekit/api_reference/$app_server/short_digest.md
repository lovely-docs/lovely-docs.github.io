Server-side utilities: `command`, `form`, `query`, `prerender` for remote function execution; `getRequestEvent` to access current request context; `read` to load imported assets. All remote functions support optional schema validation and unchecked inputs.

```js
import { command, form, query, prerender, getRequestEvent, read } from '$app/server';

// Remote functions execute on server when called from browser
const cmd = command(() => 'result');
const frm = form('unchecked', (data, invalid) => handleForm(data));
const qry = query(schema, (arg) => fetchData(arg));
const pre = prerender(() => generatePage(), { dynamic: true });
const batch = query.batch(schema, (args) => (arg, idx) => process(arg));

// Access request context
const event = getRequestEvent();

// Read imported assets
const asset = read(importedFile);
const text = await asset.text();
```