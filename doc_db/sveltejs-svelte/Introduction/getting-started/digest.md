## Setup with SvelteKit (recommended)

```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

SvelteKit is the official application framework from the Svelte team, powered by Vite. It lets you build almost anything and you can learn its advanced features later.

## Alternative: Vite standalone

Use Vite directly without SvelteKit:

```bash
npm create vite@latest
# select svelte option
npm run build  # generates HTML, JS, CSS in dist/
```

This uses vite-plugin-svelte. You'll likely need to add a routing library separately.

## Other build tools

Plugins exist for Rollup, Webpack, and others, but Vite is recommended.

## Editor support

- VS Code extension maintained by Svelte team
- Integrations available for various other editors
- Command-line checking with `sv check`

## Getting help

Ask in the Discord chatroom or Stack Overflow (tag: svelte).