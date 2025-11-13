**Out of box**: SSR enabled by default (better indexing), minimal performance overhead, automatic URL normalization.

**Manual setup**: Add unique `<title>` and `<meta name="description">` to each page. Create sitemaps via endpoint. For AMP support, set `inlineStyleThreshold: Infinity`, disable CSR, add `amp` to HTML, and transform with `@sveltejs/amp` in hooks.