Module that exports environment-related constants for SvelteKit applications.

**Exports:**

- `browser: boolean` — True if the app is running in the browser (false during server-side rendering or build)
- `building: boolean` — True during the build step and prerendering when SvelteKit analyzes the app
- `dev: boolean` — True when the dev server is running (not guaranteed to match NODE_ENV or MODE)
- `version: string` — The value of `config.kit.version.name`

**Usage:**
```js
import { browser, building, dev, version } from '$app/environment';
```

Use these to conditionally execute code based on the runtime environment.