## Generated Types for Routes

SvelteKit automatically generates `.d.ts` files for each endpoint and page, providing typed `RequestHandler` and `Load` functions based on route parameters.

Instead of manually typing params:
```js
/** @type {import('@sveltejs/kit').RequestHandler<{foo: string; bar: string; baz: string}>} */
export async function GET({ params }) {}
```

Use the generated `$types` module:
```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

The generated `.svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts` exports `RequestHandler` and `PageLoad` types with route params automatically inferred.

## Type Exports from $types

- `PageData`: Return type of page `load` functions
- `LayoutData`: Return type of layout `load` functions
- `ActionData`: Union of all `Actions` return types
- `PageProps` (v2.16.0+): Combines `data: PageData` and `form: ActionData`
- `LayoutProps` (v2.16.0+): Combines `data: LayoutData` and `children: Snippet`

Usage in components:
```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

## TypeScript Configuration

Your `tsconfig.json` or `jsconfig.json` must extend `.svelte-kit/tsconfig.json`:
```json
{ "extends": "./.svelte-kit/tsconfig.json" }
```

The generated config uses `rootDirs` to allow importing `$types` as siblings. Key compiler options include `verbatimModuleSyntax: true`, `isolatedModules: true`, `noEmit: true`, and `moduleResolution: "bundler"`.

Extend or modify the generated config using the `typescript.config` setting in `svelte.config.js`.

## $lib Alias

`$lib` is an alias to `src/lib` (or configured `config.kit.files.lib`). `$lib/server` is a subdirectory where SvelteKit prevents client-side imports.

## app.d.ts Ambient Types

The `App` namespace in `app.d.ts` defines:
- `App.Error`: Shape of errors (has `message: string`)
- `App.Locals`: Type of `event.locals` in hooks and server functions
- `App.PageData`: Shared data across all pages
- `App.PageState`: Shape of `page.state` for `pushState`/`replaceState`
- `App.Platform`: Platform-specific context from adapters