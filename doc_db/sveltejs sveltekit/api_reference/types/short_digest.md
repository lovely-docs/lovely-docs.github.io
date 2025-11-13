## Generated Types

SvelteKit generates `.d.ts` files for routes, exporting typed `RequestHandler` and `PageLoad` from `$types`:
```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

`$types` exports: `PageData`, `LayoutData`, `ActionData`, `PageProps`, `LayoutProps`.

Extend `tsconfig.json` from `.svelte-kit/tsconfig.json` to enable `$types` imports.

## app.d.ts Ambient Types

Define `App.Error`, `App.Locals`, `App.PageData`, `App.PageState`, `App.Platform` in `app.d.ts` to type SvelteKit features globally.