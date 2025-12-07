Deprecated store-based API for accessing SvelteKit runtime data. Use `$app/state` instead for SvelteKit 2.12+.

**getStores()** - Function that returns an object containing `page`, `navigating`, and `updated` stores.

**navigating** - Readable store containing a `Navigation` object (with `from`, `to`, `type`, and optional `delta` properties) while navigation is in progress, otherwise `null`. Server-side subscription only during component initialization; browser-side subscription anytime.

**page** - Readable store containing page data. Server-side subscription only during component initialization; browser-side subscription anytime.

**updated** - Readable store with initial value `false`. When `version.pollInterval` is non-zero, SvelteKit polls for new app versions and updates the store to `true` when detected. Includes `check()` method to force immediate version check. Server-side subscription only during component initialization; browser-side subscription anytime.

```js
import { getStores, navigating, page, updated } from '$app/stores';
```