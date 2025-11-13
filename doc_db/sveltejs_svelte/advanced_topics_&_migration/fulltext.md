

## Pages

### testing
Testing strategies for Svelte: unit/component tests with Vitest, component stories with Storybook, and E2E tests with Playwright.

## Vitest Unit & Component Tests

Configure `vite.config.js` with `resolve: { conditions: ['browser'] }` when `VITEST` env var is set. Name test files `.svelte.test.js` to use runes. Use `$effect.root()` and `flushSync()` for effect tests. Mount components with `mount(Component, { target, props })` and use `@testing-library/svelte` for higher-level testing.

## Storybook

Create stories with `play` functions for interaction testing using Testing Library and Vitest APIs.

## Playwright E2E

Configure `playwright.config.js` with `webServer` to start your app. Write tests using Playwright's page API to interact with the DOM.

### typescript
How to use TypeScript in Svelte components, including setup, typing props/state, and working with component types.

## TypeScript in Svelte

Add `lang="ts"` to script tags for type-only features. For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`.

**tsconfig.json**: Set `target` to `ES2015`, `verbatimModuleSyntax` to `true`, `isolatedModules` to `true`.

**Typing $props**:
```svelte
<script lang="ts">
	interface Props { requiredProperty: number; }
	let { requiredProperty }: Props = $props();
</script>
```

**Generic $props**:
```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props { items: Item[]; select(item: Item): void; }
	let { items, select }: Props = $props();
</script>
```

**Wrapper components**: Use `HTMLButtonAttributes` or `SvelteHTMLElements` from `svelte/elements`.

**$state typing**: `let count: number = $state(0);` or use `as` casting for undefined initial values.

**Component type**: Use `Component` and `ComponentProps` to type dynamic components.

**Augment DOM types**: Extend `svelte/elements` module for custom attributes/events.

### custom_elements
Compile Svelte components to web components with customElement option, configure properties and lifecycle, be aware of style encapsulation and slot rendering differences.

## Custom Elements

Compile Svelte components to web components with `customElement: true` and `<svelte:options customElement="my-element" />`. Props are exposed as DOM properties and attributes.

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'world' } = $props();
</script>
<h1>Hello {name}!</h1>
```

Register with `customElements.define('my-element', MyElement.element)`.

Configure with object syntax: `tag`, `shadow: "none"`, `props` (with `attribute`, `reflect`, `type`), and `extend` function for lifecycle customization.

**Key differences**: styles are encapsulated, slotted content renders eagerly, context doesn't cross custom element boundaries, properties starting with `on` become event listeners.

### v4_migration_guide
Breaking changes and migration steps for upgrading from Svelte 3 to Svelte 4, including version requirements, type strictness improvements, API deprecations, and behavioral changes.

## Key breaking changes for Svelte 4

**Version requirements:** Node 16+, TypeScript 5+, SvelteKit 1.20.4+, webpack 5+

**Bundler config:** Must specify `browser` condition (Rollup: `browser: true` in node-resolve; webpack: add `"browser"` to `conditionNames`)

**Output format:** CommonJS removed; use bundler to convert ESM to CJS if needed

**Type strictness:**
- `createEventDispatcher<{ required: string }>` now enforces payload requirements
- `Action<HTMLElement, string>` requires generic parameter if action uses params
- `onMount` errors on async function returns

**API changes:**
- `tag` → `customElement` in `<svelte:options>`
- `SvelteComponentTyped` → `SvelteComponent`
- Transitions local by default; use `|global` for old behavior
- Slot bindings no longer shared between default and named slots
- Preprocessors run in order (markup → script → style per preprocessor)

**Other:** `eslint-plugin-svelte3` deprecated (use `eslint-plugin-svelte`), `svelte.JSX` → `svelteHTML` namespace

### svelte_5_migration_guide
Svelte 5 replaces implicit reactivity with explicit runes ($state, $derived, $effect), converts event directives to properties, replaces slots with snippets, changes components from classes to functions, and requires modern browser features.

## Key Changes

**Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props, event modifiers removed

**Slots**: Replaced with snippets using `$props()` and `{@render}`

**Components**: Now functions, use `mount(App, { target })` instead of `new App()`

**Runes mode**: Properties not bindable by default, use `$bindable()`, classes not auto-reactive

**Migration**: Run `npx sv migrate svelte-5` for automatic conversion

### frequently_asked_questions
Common questions about getting started with Svelte, finding support, tooling, testing strategies, routing, mobile development, and styling practices.

**Getting Started**: Interactive tutorial recommended (5-10 min to start, 1.5 hrs full).

**Support**: Reference docs, Stack Overflow, Discord, Reddit.

**Tooling**: Official VS Code extension, prettier-plugin-svelte, JSDoc comments with `@component` tag for docs.

**Testing**: Unit (Vitest), Component (jsdom/Playwright/Cypress), E2E (Playwright).

**Architecture**: SvelteKit for routing/SSR/HMR; mobile via SvelteKit SPA + Tauri/Capacitor.

**Styling**: Unused styles removed by compiler; use `:global(...)` for global styles.

**HMR**: Use SvelteKit or community plugins for rollup/webpack.

