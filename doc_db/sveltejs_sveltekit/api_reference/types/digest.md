## Generated types

SvelteKit automatically generates `.d.ts` files for each endpoint and page, providing typed `RequestHandler` and `Load` functions with route parameters.

Instead of manually typing params:
```js
/** @type {import('@sveltejs/kit').RequestHandler<{
    foo: string;
    bar: string;
    baz: string
  }>} */
export async function GET({ params }) {}
```

SvelteKit generates `.svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts`:
```ts
import type * as Kit from '@sveltejs/kit';
type RouteParams = { foo: string; bar: string; baz: string; };
export type RequestHandler = Kit.RequestHandler<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;
```

Import via `$types` module (enabled by `rootDirs` in tsconfig):
```js
// +server.js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}

// +page.js
/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {}
```

Return types available as `PageData` and `LayoutData` from `$types`. Union of all `Actions` available as `ActionData`.

Since v2.16.0, helper types `PageProps` (includes `data: PageData` and `form: ActionData`) and `LayoutProps` (includes `data: LayoutData` and `children: Snippet`):
```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

Legacy (pre-2.16.0 or Svelte 4):
```svelte
<script>
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
	// or with Svelte 4:
	export let data; // @type {import('./$types').PageData}
	export let form; // @type {import('./$types').ActionData}
</script>
```

Requires `tsconfig.json` to extend `.svelte-kit/tsconfig.json`: `{ "extends": "./.svelte-kit/tsconfig.json" }`

## Default tsconfig.json

Generated `.svelte-kit/tsconfig.json` contains programmatically-generated options (paths, rootDirs) and required options for SvelteKit:
- `verbatimModuleSyntax: true` - ensures types imported with `import type`
- `isolatedModules: true` - Vite compiles one module at a time
- `noEmit: true` - type-checking only
- `lib: ["esnext", "DOM", "DOM.Iterable"]`
- `moduleResolution: "bundler"`
- `module: "esnext"`
- `target: "esnext"`

Extend or modify via `typescript.config` in `svelte.config.js`.

## $lib

Alias to `src/lib` (or configured `config.kit.files.lib`). Avoids relative path imports.

### $lib/server

Subdirectory of `$lib`. SvelteKit prevents importing `$lib/server` modules into client-side code (server-only modules).

## app.d.ts

Contains ambient types available without explicit imports. Includes `App` namespace with types influencing SvelteKit features.

### App.Error

Shape of expected/unexpected errors. Expected errors thrown via `error()` function. Unexpected errors handled by `handleError` hooks.
```ts
interface Error {
  message: string;
}
```

### App.Locals

Interface defining `event.locals`, accessible in server hooks (`handle`, `handleError`), server-only `load` functions, and `+server.js` files.
```ts
interface Locals {}
```

### App.PageData

Shape of `page.data` state and `$page.data` store (data shared between all pages). `Load` and `ServerLoad` functions narrowed accordingly. Use optional properties for page-specific data; avoid index signatures.
```ts
interface PageData {}
```

### App.PageState

Shape of `page.state` object, manipulated via `pushState()` and `replaceState()` from `$app/navigation`.
```ts
interface PageState {}
```

### App.Platform

Platform-specific context from adapter via `event.platform`.
```ts
interface Platform {}
```