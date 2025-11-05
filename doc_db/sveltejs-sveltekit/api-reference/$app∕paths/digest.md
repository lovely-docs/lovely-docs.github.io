The `$app/paths` module provides access to application path configuration values that are set during build time.

**Exported values:**
- `base` - The base path of the application (default: `''`)
- `assets` - The path where static assets are served from (default: `base`)

These values are determined by the `config.kit.paths` configuration in `svelte.config.js`.

**Usage example:**
```javascript
import { base, assets } from '$app/paths';

// Use base for routing
const url = `${base}/page`;

// Use assets for static resources
const image = `${assets}/image.png`;
```