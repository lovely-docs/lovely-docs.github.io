## Setup

```js
import adapter from '@sveltejs/adapter-node';
const config = { kit: { adapter: adapter() } };
```

Build with `npm run build`, deploy `build/`, `package.json`, and `node_modules/`. Start with `node build`.

## Environment Variables

- `PORT`, `HOST`: server binding (default 0.0.0.0:3000)
- `SOCKET_PATH`: Unix socket instead of PORT/HOST
- `ORIGIN`: deployment URL (e.g., `https://my.site`)
- `PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`: for reverse proxies
- `ADDRESS_HEADER`, `XFF_DEPTH`: client IP detection behind proxies
- `BODY_SIZE_LIMIT`: max request body (default 512kb)
- `SHUTDOWN_TIMEOUT`: graceful shutdown wait time (default 30s)
- `IDLE_TIMEOUT`: auto-sleep with systemd socket activation

Production `.env` loading requires: `node -r dotenv/config build` or `node --env-file=.env build` (Node v20.6+)

## Options

```js
adapter({ out: 'build', precompress: true, envPrefix: '' })
```

## Custom Server

```js
import { handler } from './build/handler.js';
import express from 'express';
const app = express();
app.use(handler);
app.listen(3000);
```

Graceful shutdown via `process.on('sveltekit:shutdown', async (reason) => {...})`