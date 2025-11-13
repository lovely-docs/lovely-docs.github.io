## Setup with SvelteKit

The recommended way to start is using SvelteKit, the official application framework:

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

## Alternative: Vite

Use Vite directly without SvelteKit:

```sh
npm create vite@latest
# select svelte option
npm run build  # generates HTML, JS, CSS in dist/
```

This uses vite-plugin-svelte. You'll likely need to add a routing library separately.

## Other bundlers

Plugins exist for other bundlers, but Vite is recommended.

## Editor support

- VS Code extension maintained by Svelte team
- Integrations available for other editors
- Command-line checking with `sv check`

## Getting help

Ask in the Discord chatroom or Stack Overflow (tag: svelte)