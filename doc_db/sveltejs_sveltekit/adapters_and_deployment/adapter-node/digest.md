## Usage

Install with `npm i -D @sveltejs/adapter-node`, then add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Deploying

Build with `npm run build` (outputs to `build` by default). To run: `node build`

You need the output directory, `package.json`, and production dependencies. Generate production dependencies with `npm ci --omit dev`. Development dependencies are bundled via Rollup; control bundling by placing packages in `devDependencies` (bundled) or `dependencies` (external).

## Compression

For custom servers, use `@polka/compression` instead of the popular `compression` package, as SvelteKit streams responses and `compression` doesn't support streaming.

## Environment Variables

In dev/preview, `.env` files are auto-loaded. In production, manually load with:
```sh
node -r dotenv/config build
# or Node.js v20.6+:
node --env-file=.env build
```

### Connection Configuration

**`PORT`, `HOST`, `SOCKET_PATH`**: Default is `0.0.0.0:3000`
```sh
HOST=127.0.0.1 PORT=4000 node build
SOCKET_PATH=/tmp/socket node build
```

**`ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`**: Tell SvelteKit the request URL
```sh
ORIGIN=https://my.site node build
PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build
```

**`ADDRESS_HEADER`, `XFF_DEPTH`**: Get client IP from headers when behind proxies
```sh
ADDRESS_HEADER=True-Client-IP node build
```
For `X-Forwarded-For` with multiple proxies, use `XFF_DEPTH=3` to read from the right (prevents spoofing).

**`BODY_SIZE_LIMIT`**: Max request body in bytes (supports K/M/G suffixes, defaults to 512kb)
```sh
BODY_SIZE_LIMIT=1M node build
```

**`SHUTDOWN_TIMEOUT`**: Seconds to wait before forcefully closing connections on SIGTERM/SIGINT (defaults to 30)

**`IDLE_TIMEOUT`**: Seconds before auto-sleep with systemd socket activation

## Options

```js
adapter({
	out: 'build',           // output directory
	precompress: true,      // gzip/brotli compression for assets
	envPrefix: ''           // prefix for env vars (e.g., 'MY_CUSTOM_')
})
```

With `envPrefix: 'MY_CUSTOM_'`, use `MY_CUSTOM_HOST`, `MY_CUSTOM_PORT`, `MY_CUSTOM_ORIGIN`, etc.

## Graceful Shutdown

On SIGTERM/SIGINT, the server:
1. Rejects new requests
2. Waits for in-flight requests to finish
3. Closes remaining connections after `SHUTDOWN_TIMEOUT`

Listen to `sveltekit:shutdown` event for cleanup:
```js
process.on('sveltekit:shutdown', async (reason) => {
  await jobs.stop();
  await db.close();
});
```

`reason` is `SIGINT`, `SIGTERM`, or `IDLE`.

## Socket Activation

For systemd socket activation, the OS passes `LISTEN_PID` and `LISTEN_FDS` env vars. The adapter listens on file descriptor 3.

Example systemd service:
```ini
[Service]
Environment=NODE_ENV=production IDLE_TIMEOUT=60
ExecStart=/usr/bin/node /usr/bin/myapp/build
```

Example socket unit:
```ini
[Socket]
ListenStream=3000

[Install]
WantedBy=sockets.target
```

Enable with `sudo systemctl enable --now myapp.socket`.

## Custom Server

The build outputs `index.js` (standalone server) and `handler.js` (middleware). Use `handler.js` with Express, Connect, Polka, or Node's `http.createServer`:

```js
import { handler } from './build/handler.js';
import express from 'express';

const app = express();
app.get('/healthcheck', (req, res) => res.end('ok'));
app.use(handler);
app.listen(3000);
```