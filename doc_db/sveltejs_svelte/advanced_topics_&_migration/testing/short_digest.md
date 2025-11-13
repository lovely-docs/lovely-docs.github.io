## Vitest Unit & Component Tests

Configure `vite.config.js` with `resolve: { conditions: ['browser'] }` when `VITEST` env var is set. Name test files `.svelte.test.js` to use runes. Use `$effect.root()` and `flushSync()` for effect tests. Mount components with `mount(Component, { target, props })` and use `@testing-library/svelte` for higher-level testing.

## Storybook

Create stories with `play` functions for interaction testing using Testing Library and Vitest APIs.

## Playwright E2E

Configure `playwright.config.js` with `webServer` to start your app. Write tests using Playwright's page API to interact with the DOM.