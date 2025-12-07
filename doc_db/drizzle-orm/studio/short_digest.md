## Overview
`drizzle-kit studio` starts a local database browser server on `127.0.0.1:4983` (configurable via `--host` and `--port`). Requires database credentials in `drizzle.config.ts`.

## Configuration
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url: "postgresql://user:password@host:port/dbname" }
});
```

```shell
drizzle-kit studio --port=3000 --host=0.0.0.0 --verbose
```

## Features
- **Logging**: Use `--verbose` flag for SQL statement logging
- **Safari/Brave**: Install mkcert and run `mkcert -install` to bypass localhost blocking
- **Embeddable Component**: Framework-agnostic web component available for B2B (used by Turso, Neon, Hydra, Nuxt Hub, Deco.cx)
- **Chrome Extension**: Browse PlanetScale, Cloudflare D1, Vercel Postgres databases in vendor panels

## Limitations
- Local development only; Drizzle Studio Gateway (alpha) available for VPS deployment
- Not open source (closed to enable B2B monetization)