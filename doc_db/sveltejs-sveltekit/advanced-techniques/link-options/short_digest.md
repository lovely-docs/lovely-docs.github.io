## Link Navigation Attributes

Control SvelteKit link behavior with `data-sveltekit-*` attributes:

- **data-sveltekit-preload-data**: `"hover"` (default) or `"tap"` — when to preload page data
- **data-sveltekit-preload-code**: `"eager"`, `"viewport"`, `"hover"`, or `"tap"` — when to preload code
- **data-sveltekit-reload**: force full-page browser navigation
- **data-sveltekit-replacestate**: replace history entry instead of pushing new one
- **data-sveltekit-keepfocus**: retain focus after navigation
- **data-sveltekit-noscroll**: prevent scroll to top after navigation

Disable with `"false"` value. Respects `navigator.connection.saveData`.