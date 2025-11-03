## Testing

**Unit/Integration Testing**: Use Vitest with `vite.config.js` configured for browser entry points. Wrap effect tests in `$effect.root()` and use `flushSync()` for synchronous execution.

```js
test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
});
```

**Component Testing**: Use `mount()` API or `@testing-library/svelte`:

```js
const component = mount(Component, { target: document.body, props: { initial: 0 } });
```

**E2E Testing**: Use Playwright with `playwright.config.js` webServer settings:

```js
test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```

## TypeScript

Add `lang="ts"` to script tags. Configure `vitePreprocess` in `svelte.config.js` and set `tsconfig.json` with `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select }: Props = $props();
	let count: number = $state(0);
</script>
```

Use `Component<Props>` and `ComponentProps<TComponent>` for type constraints. Extend custom elements via `.d.ts`:

```ts
declare namespace svelteHTML {
	interface IntrinsicElements {
		'my-custom-element': { someattribute: string };
	}
}
```

## Custom Elements

Compile to web components with `customElement: true` and `<svelte:options customElement="tag-name" />`. Props exposed as DOM properties and attributes.

```svelte
<svelte:options customElement={{ tag: 'my-element', props: { name: { reflect: true } } }} />
```

Configure via `tag`, `shadow: "none"`, `props` (with `attribute`, `reflect`, `type`), and `extend` function. Limitations: styles encapsulated, not SSR-friendly, slotted content eager, context doesn't cross boundaries, avoid property names starting with `on`.

## Svelte 4 Migration

**Minimum versions**: Node 16+, TypeScript 5+, SvelteKit 1.20.4+, webpack 5+. Bundlers must specify `browser` condition. No CommonJS output. Stricter types for `createEventDispatcher`, `Action`, `ActionReturn`, `onMount`. `tag` option → `customElement`, `SvelteComponentTyped` → `SvelteComponent`. Transitions local by default (use `|global` modifier). Slot bindings no longer exposed to named slots. Preprocessors execute in order, each must have a name. Switch ESLint from `eslint-plugin-svelte3` to `eslint-plugin-svelte`. `svelte.JSX` → `svelteHTML`.

## Svelte 5 Migration

**Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props

**Slots**: `<slot />` → `children` prop with `{@render}`, named slots → props, `let:` → snippets

**Components**: Classes → functions, use `mount(App, {target})` instead of `new App({target})`

**Other**: Bindable props need `$bindable()`, stricter HTML, modern browsers only, `null`/`undefined` render empty, form resets trigger bindings

Run `npx sv migrate svelte-5` for automatic migration.

## FAQs

**Support**: Reference docs, Stack Overflow (tag: svelte), Discord, Reddit

**Tooling**: Official VS Code extension, prettier-plugin-svelte

**Testing**: Vitest (unit), Playwright/Cypress (E2E)

**Routing**: SvelteKit (official) or page.js, navaid, svelte-spa-router, Routify

**Mobile**: SvelteKit SPA → Tauri/Capacitor; Svelte Native for Svelte 4 only

**Styling**: Svelte removes unused styles; use `:global(...)` for global styles