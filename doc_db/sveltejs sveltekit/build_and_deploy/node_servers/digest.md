## Installation and Setup

Install `@sveltejs/adapter-node` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Building and Running

Build with `npm run build` (outputs to `build` directory by default). Deploy the `build` directory, `package.json`, and production dependencies. Start with `node build`.

Development dependencies are bundled via Rollup. Control bundling by placing packages in `devDependencies` (bundled) or `dependencies` (external).

## Compression

For custom servers, use `@polka/compression` instead of the popular `compression` package, as SvelteKit streams responses and `compression` doesn't support streaming.

## Environment Variables

Production doesn't auto-load `.env` files. Install dotenv and run:
```sh
node -r dotenv/config build
# or Node.js v20.6+:
node --env-file=.env build
```

**Server Configuration:**
- `PORT` (default 3000) and `HOST` (default 0.0.0.0): `HOST=127.0.0.1 PORT=4000 node build`
- `SOCKET_PATH`: `SOCKET_PATH=/tmp/socket node build` (overrides HOST/PORT)
- `ORIGIN`: `ORIGIN=https://my.site node build` - tells SvelteKit the deployment URL
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`: for reverse proxies (e.g., `PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host`)
- `ADDRESS_HEADER`: read client IP from header (e.g., `ADDRESS_HEADER=True-Client-IP`)
- `XFF_DEPTH`: for `X-Forwarded-For`, specify number of trusted proxies
- `BODY_SIZE_LIMIT`: max request body (default 512kb, supports K/M/G suffixes)
- `SHUTDOWN_TIMEOUT`: seconds to wait before force-closing connections (default 30)
- `IDLE_TIMEOUT`: seconds before auto-sleep with systemd socket activation

With `envPrefix` option, prefix all variables: `envPrefix: 'MY_CUSTOM_'` → `MY_CUSTOM_PORT`, `MY_CUSTOM_HOST`, etc.

## Adapter Options

```js
adapter({
	out: 'build',           // output directory
	precompress: true,      // gzip/brotli compression
	envPrefix: ''           // environment variable prefix
})
```

## Graceful Shutdown

Adapter automatically handles `SIGTERM`/`SIGINT` by rejecting new requests, waiting for in-flight requests, then force-closing after `SHUTDOWN_TIMEOUT`. Listen to `sveltekit:shutdown` event for cleanup:

```js
process.on('sveltekit:shutdown', async (reason) => {
  // reason: 'SIGINT', 'SIGTERM', or 'IDLE'
  await db.close();
});
```

## Socket Activation (systemd)

Configure systemd socket activation for on-demand app scaling. Create service and socket units, then `sudo systemctl enable --now myapp.socket`.

## Custom Server

Import `handler.js` from build directory for use with Express, Connect, Polka, or Node's `http.createServer`:

```js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();
app.get('/healthcheck', (req, res) => res.end('ok'));
app.use(handler);
app.listen(3000);
```