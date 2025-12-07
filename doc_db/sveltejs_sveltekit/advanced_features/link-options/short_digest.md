SvelteKit link navigation customization via `data-sveltekit-*` attributes:
- **data-sveltekit-preload-data**: `"hover"` (default) or `"tap"` - preload page data on interaction
- **data-sveltekit-preload-code**: `"eager"`, `"viewport"`, `"hover"`, `"tap"` - preload code with varying eagerness
- **data-sveltekit-reload**: Force full-page browser navigation
- **data-sveltekit-replacestate**: Replace history entry instead of pushing new one
- **data-sveltekit-keepfocus**: Keep focus on current element after navigation
- **data-sveltekit-noscroll**: Prevent scroll-to-top after navigation
- Disable with `"false"` value; apply conditionally with `{condition ? 'value' : false}`