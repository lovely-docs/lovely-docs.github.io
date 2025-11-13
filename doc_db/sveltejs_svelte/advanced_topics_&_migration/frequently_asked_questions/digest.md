**Getting Started**
- Interactive tutorial is the recommended starting point, takes 5-10 minutes to get running, 1.5 hours for full completion.

**Support & Resources**
- Reference docs for syntax questions
- Stack Overflow for code-level questions (tag: svelte)
- Discord and Reddit for discussions and best practices
- Svelte Society maintains a list of books and videos

**Tooling**
- Official VS Code extension for syntax highlighting
- Prettier with prettier-plugin-svelte for formatting
- Component documentation using JSDoc comments with `@component` tag in HTML comments

**Testing**
- Three test types: Unit (business logic), Component (DOM-based validation), E2E (production simulation)
- Unit testing: Vitest recommended for new SvelteKit projects
- Component testing: jsdom + Vitest, or browser-based with Playwright/Cypress
- E2E testing: Playwright recommended for new SvelteKit projects
- Resources: Svelte Testing Library, Cypress component testing, WebdriverIO

**Architecture & Scaling**
- UI component libraries available on packages page
- Official router is SvelteKit (filesystem-based, SSR, HMR)
- Mobile apps: SvelteKit SPA with Tauri or Capacitor for native features
- Svelte 5 custom renderer support in progress (Svelte Native not currently supported)

**Styling**
- Unused styles are removed by compiler to prevent scoping issues
- Use `:global(...)` to opt into global styles
- Partial global selectors like `.foo :global(.bar)` are supported

**Other**
- Svelte v2 no longer receives new features, documentation still available
- Hot module reloading: use SvelteKit (built on Vite + svelte-hmr), or community plugins for rollup/webpack