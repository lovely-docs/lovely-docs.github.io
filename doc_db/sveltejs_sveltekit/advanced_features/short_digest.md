## Advanced Routing
- Rest/optional parameters, matchers, layout groups, layout hierarchy control via `@segment`
- Character encoding: `[x+3a]` for `:`, `[u+nnnn]` for Unicode

## Hooks
- `handle`, `handleFetch`, `handleError` in `src/hooks.server.js`
- `reroute`, `transport` in `src/hooks.js`

## Errors
- `error(404, {...})` for expected errors; customize via `App.Error` interface
- `src/error.html` for fallback error page with `%sveltekit.status%` and `%sveltekit.error.message%`

## Link Options
- `data-sveltekit-preload-data`, `data-sveltekit-preload-code`, `data-sveltekit-reload`, `data-sveltekit-replacestate`, `data-sveltekit-keepfocus`, `data-sveltekit-noscroll`

## Service Workers
- Auto-bundles `src/service-worker.js`; access `$service-worker` for `build`, `files`, `version`

## Server-only Modules
- `.server` suffix or `$lib/server/` directory prevents browser exposure of sensitive code

## Snapshots
- Export `snapshot` with `capture()` and `restore()` to preserve DOM state across navigation

## Shallow Routing
- `pushState(url, state)`, `replaceState(url, state)`, `preloadData(href)` for modals/overlays
- Access state via `page.state`; declare `App.PageState` for type safety

## Observability
- Enable `tracing.server` and `instrumentation.server` in `svelte.config.js`
- Add custom attributes via `event.tracing.root` and `event.tracing.current`

## Packaging
- `@sveltejs/package` builds libraries; configure `exports` with `types` and `svelte` conditions
- Use `typesVersions` for non-root exports; mark CSS as `sideEffects`