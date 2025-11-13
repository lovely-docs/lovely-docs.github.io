**Getting Started**: Interactive tutorial recommended (5-10 min to start, 1.5 hrs full).

**Support**: Reference docs, Stack Overflow, Discord, Reddit.

**Tooling**: Official VS Code extension, prettier-plugin-svelte, JSDoc comments with `@component` tag for docs.

**Testing**: Unit (Vitest), Component (jsdom/Playwright/Cypress), E2E (Playwright).

**Architecture**: SvelteKit for routing/SSR/HMR; mobile via SvelteKit SPA + Tauri/Capacitor.

**Styling**: Unused styles removed by compiler; use `:global(...)` for global styles.

**HMR**: Use SvelteKit or community plugins for rollup/webpack.