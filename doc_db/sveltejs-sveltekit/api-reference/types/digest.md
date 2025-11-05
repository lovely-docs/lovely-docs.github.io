## Generated Types

SvelteKit automatically generates `.d.ts` files for each endpoint and page that export typed versions of `RequestHandler` and `Load`. These files are located at `.svelte-kit/types/src/routes/[params]/$types.d.ts` and can be imported as siblings thanks to the `rootDirs` TypeScript configuration option.

Instead of manually typing params:
```js
/** @type {import('@sveltejs/kit').RequestHandler<{ foo: string; bar: string; baz: string }>} */
export async function GET({ params }) {}
```

Import from the generated `$types` module:
```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

The `$types` module also exports `PageData`, `LayoutData`, and `ActionData` types representing the return types of load functions and actions. Starting with version 2.16.0, helper types `PageProps` and `LayoutProps` are available that combine data and form/children properties.

## Configuration

Your `tsconfig.json` or `jsconfig.json` must extend `./.svelte-kit/tsconfig.json` for this to work. The generated tsconfig includes path aliases like `$lib` pointing to `src/lib`, and `rootDirs` configuration enabling the `$types` imports.

## $lib Alias

`$lib` is an alias to `src/lib` (or custom `config.kit.files.lib` directory). `$lib/server` is a subdirectory where SvelteKit prevents client-side imports of server-only modules.

## app.d.ts

The `app.d.ts` file contains ambient types available without explicit imports, including the `App` namespace that influences SvelteKit feature shapes.