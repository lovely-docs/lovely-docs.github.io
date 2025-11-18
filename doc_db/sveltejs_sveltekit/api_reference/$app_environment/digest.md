The `$app/environment` module exports four constants for runtime environment detection:

- `browser: boolean` — `true` when running in the browser, `false` on the server
- `building: boolean` — `true` during the build step and prerendering, `false` otherwise
- `dev: boolean` — `true` when the dev server is running (not guaranteed to match `NODE_ENV` or `MODE`)
- `version: string` — the value of `config.kit.version.name`

Example usage:
```js
import { browser, building, dev, version } from '$app/environment';

if (browser) {
  // Browser-only code
}

if (building) {
  // Build/prerender-only code
}

if (dev) {
  // Dev server code
}

console.log(version);
```