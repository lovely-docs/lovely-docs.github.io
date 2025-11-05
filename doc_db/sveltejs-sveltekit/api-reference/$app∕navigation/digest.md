The `$app/navigation` module provides utilities for programmatic navigation in SvelteKit applications.

**Key exports:**
- `goto(url, options)` - Navigate to a URL programmatically with optional state and replaceHistory parameters
- `invalidateAll()` - Invalidate all data and re-run load functions
- `invalidate(url)` - Invalidate specific data based on URL dependency

These functions enable client-side navigation without full page reloads and allow manual cache invalidation when needed.