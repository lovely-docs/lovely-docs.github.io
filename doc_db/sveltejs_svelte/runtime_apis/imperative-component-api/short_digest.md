## Core Functions
- **`mount(Component, { target, props })`** — Instantiate and mount component to DOM. Effects don't run; use `flushSync()` if needed.
- **`unmount(app, { outro })`** — Remove component, optionally playing transitions. Returns Promise.
- **`render(Component, { props })`** — Server-only; returns `{ body, head }` for SSR.
- **`hydrate(Component, { target, props })`** — Mount component reusing SSR HTML. Effects don't run; use `flushSync()` if needed.