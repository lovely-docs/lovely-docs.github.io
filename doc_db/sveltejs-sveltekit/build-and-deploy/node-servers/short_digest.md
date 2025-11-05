## Setup

Install `@sveltejs/adapter-node` and add to `svelte.config.js`. Build with `npm run build`, deploy `build/`, `package.json`, and `node_modules/`. Start with `node build`.

## Environment Variables

- `PORT` (3000), `HOST` (0.0.0.0), `SOCKET_PATH`
- `ORIGIN` - deployment URL
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER` - reverse proxy headers
- `ADDRESS_HEADER`, `XFF_DEPTH` - client IP detection
- `BODY_SIZE_LIMIT` (512kb), `SHUTDOWN_TIMEOUT` (30s), `IDLE_TIMEOUT`

## Adapter Options

```js
adapter({ out: 'build', precompress: true, envPrefix: '' })
```

## Custom Server

Import `handler.js` for Express/Connect/Polka:

```js
import { handler } from './build/handler.js';
import express from 'express';
app.use(handler);
```

## Graceful Shutdown & systemd

Listen to `sveltekit:shutdown` event. Supports systemd socket activation with `LISTEN_PID`/`LISTEN_FDS`.