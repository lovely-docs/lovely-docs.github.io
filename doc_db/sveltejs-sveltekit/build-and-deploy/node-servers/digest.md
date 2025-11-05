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

## Environment Variables

**In production**, `.env` files aren't auto-loaded. Load with:
```sh
node -r dotenv/config build
# or Node.js v20.6+:
node --env-file=.env build
```

**Server configuration:**
- `PORT` (default 3000) and `HOST` (default 0.0.0.0)
- `SOCKET_PATH` - use Unix socket instead of HOST/PORT
- `ORIGIN` - set the deployment URL (e.g., `https://my.site`)
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER` - read from reverse proxy headers (e.g., `x-forwarded-proto`)
- `ADDRESS_HEADER` - read client IP from header (e.g., `True-Client-IP`)
- `XFF_DEPTH` - number of trusted proxies for `X-Forwarded-For` parsing
- `BODY_SIZE_LIMIT` - max request body (default 512kb, supports K/M/G suffixes)
- `SHUTDOWN_TIMEOUT` - seconds to wait before force-closing connections (default 30)
- `IDLE_TIMEOUT` - seconds before auto-sleep with systemd socket activation

## Adapter Options

```js
adapter({
	out: 'build',           // output directory
	precompress: true,      // gzip/brotli compression
	envPrefix: ''           // prefix for env vars (e.g., 'MY_CUSTOM_')
})
```

## Compression

For custom servers, use `@polka/compression` instead of the popular `compression` package, as SvelteKit streams responses and `compression` doesn't support streaming.

## Graceful Shutdown

On `SIGTERM`/`SIGINT`, the server rejects new requests, waits for in-flight requests to complete, then closes remaining connections after `SHUTDOWN_TIMEOUT`. Listen to `sveltekit:shutdown` event for cleanup:

```js
process.on('sveltekit:shutdown', async (reason) => {
  // reason: 'SIGINT', 'SIGTERM', or 'IDLE'
  await db.close();
});
```

## Socket Activation (systemd)

Configure systemd socket activation for on-demand app scaling. Create service and socket units, then systemd passes `LISTEN_PID` and `LISTEN_FDS` environment variables. The adapter listens on file descriptor 3.

## Custom Server

The build outputs `index.js` (standalone server) and `handler.js` (middleware). Import `handler.js` for Express/Connect/Polka:

```js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();
app.get('/healthcheck', (req, res) => res.end('ok'));
app.use(handler);
app.listen(3000);
```