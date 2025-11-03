## mount
Instantiates and mounts a component to a DOM element. Effects don't run during mount; use `flushSync()` if needed.

## unmount
Removes a mounted component. Returns a Promise that resolves after transitions if `outro: true`.

## render
Server-only function returning `{ body, head }` for SSR.

## hydrate
Like mount but reuses server-rendered HTML. Effects don't run during hydrate.