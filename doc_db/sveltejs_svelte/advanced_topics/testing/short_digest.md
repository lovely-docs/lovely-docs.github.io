## Vitest Unit & Component Tests

Configure `vite.config.js` with `vitest/config` and `{ conditions: ['browser'] }` resolver.

Unit tests for `.js/.ts` files work normally. Test files with `.svelte` in the name can use runes. Wrap effect-based tests in `$effect.root()` and use `flushSync()` to execute effects synchronously.

Component testing requires jsdom. Use `mount(Component, { target, props })` and `unmount()`, or use `@testing-library/svelte` for higher-level APIs.

## Storybook & Playwright

Storybook: Create stories with `defineMeta()` and test interactions via `play` function with `userEvent` and assertions.

Playwright: Configure `playwright.config.js` with `webServer` settings, then write E2E tests using page navigation and element locators.