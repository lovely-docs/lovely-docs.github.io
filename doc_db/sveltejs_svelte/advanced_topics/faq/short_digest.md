**Getting Started**: Interactive tutorial at /tutorial (5-10 min to start, 1.5 hrs full).

**Support**: Reference docs, Stack Overflow (tag: svelte), Discord, Reddit.

**Tooling**: VS Code extension (svelte.svelte-vscode), prettier-plugin-svelte.

**Component Docs**: Use `@component` tag in HTML comments for JSDoc-style documentation.

**Testing**: Unit tests (Vitest), Component tests (jsdom/Playwright/Cypress), E2E tests (Playwright). Extract logic from components for better coverage.

**Routing**: SvelteKit official router with filesystem routing, SSR, HMR.

**Mobile**: SvelteKit SPA + Tauri/Capacitor. Svelte Native (NativeScript) available in v4 only.

**Unused Styles**: Svelte removes them to prevent scoping issues. Use `:global(...)` for global styles or partial global selectors like `.foo :global(.bar)`.

**HMR**: Use SvelteKit (Vite + svelte-hmr) or community plugins for rollup/webpack.