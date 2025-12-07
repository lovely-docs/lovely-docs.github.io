Node.js adapter utilities for converting between Node.js HTTP objects and standard Web APIs.

**createReadableStream** (since 2.4.0)
Converts a file on disk to a readable stream.
```js
import { createReadableStream } from '@sveltejs/kit/node';
const stream = createReadableStream(file);
```

**getRequest**
Converts a Node.js IncomingMessage to a standard Request object.
```js
import { getRequest } from '@sveltejs/kit/node';
const request = await getRequest({
  request: incomingMessage,
  base: '/app',
  bodySizeLimit: 1024 * 1024
});
```

**setResponse**
Writes a standard Response object to a Node.js ServerResponse.
```js
import { setResponse } from '@sveltejs/kit/node';
await setResponse(res, response);
```