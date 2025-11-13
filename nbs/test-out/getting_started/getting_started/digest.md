## Recommended Setup

Use SvelteKit with Vite as the official application framework:

```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

## Alternative Setups

**Vite without SvelteKit:** Use `npm create vite@latest` and select the `svelte` option. This generates HTML, JS, and CSS files in the `dist` directory via vite-plugin-svelte. You'll likely need to add a routing library separately.

**Other build tools:** Plugins exist for Rollup and Webpack, but Vite is recommended.

## Development Environment

- VS Code extension maintained by the Svelte team
- Editor integrations available via Svelte Society
- Command-line checking with `sv check`

## Support

Ask questions in the Discord chatroom or Stack Overflow (tag: svelte).