## Overview
`drizzle-kit studio` command starts a local Drizzle Studio server (database browser) on `127.0.0.1:4983` by default, accessible at `local.drizzle.studio`. Requires database credentials in `drizzle.config.ts`.

## Configuration
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

### Host and Port
```shell
drizzle-kit studio --port=3000
drizzle-kit studio --host=0.0.0.0
drizzle-kit studio --host=0.0.0.0 --port=3000
```

### Logging
Enable SQL statement logging with `--verbose` flag:
```shell
drizzle-kit studio --verbose
```

### Safari and Brave Support
These browsers block localhost by default. Install mkcert and generate self-signed certificate:
1. Install mkcert
2. Run `mkcert -install`
3. Restart `drizzle-kit studio`

## Embeddable Version
Drizzle Studio component is a framework-agnostic web component for embedding in React, Vue, Svelte, VanillaJS, etc. Available as B2B offering for SaaS platforms. Used by Turso, Neon, Hydra, Nuxt Hub, and Deco.cx.

## Chrome Extension
Drizzle Studio chrome extension allows browsing PlanetScale, Cloudflare D1, and Vercel Postgres serverless databases directly in vendor admin panels.

## Limitations
- Hosted version is for local development only, not for remote/VPS deployment
- Alpha version of Drizzle Studio Gateway available for VPS deployment (contact via Twitter/Discord)

## Open Source Status
Drizzle ORM and Kit are open source; Studio is not. Local development version is free forever to enrich the ecosystem, but closed-source to enable B2B offerings and monetization.