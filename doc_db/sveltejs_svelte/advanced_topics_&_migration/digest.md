## Testing

**Unit & Component Tests with Vitest**
- Configure `vite.config.js` with `resolve: { conditions: ['browser'] }` for browser entry points
- Name test files `.svelte.test.js` to use runes; wrap effects in `$effect.root()` and use `flushSync()`
- Use Svelte's `mount` API for component testing:
```js
const component = mount(Component, { target: document.body, props: { initial: 0 } });
expect(document.body.innerHTML).toBe('<button>0</button>');
document.body.querySelector('button').click();
flushSync();
unmount(component);
```
- Use `@testing-library/svelte` for higher-level testing

**Storybook**
- Install via `npx sv add storybook`
- Create stories with interaction tests using `play` function

**E2E Tests with Playwright**
- Configure `playwright.config.js` with `webServer` to start application
- Write tests that interact with DOM:
```js
test('home page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

## TypeScript

- Add `lang="ts"` to script tags; configure preprocessor in `svelte.config.js` for full support
- Set `tsconfig.json`: `target: ES2015+`, `verbatimModuleSyntax: true`, `isolatedModules: true`
- Type props with interface and `$props()`:
```ts
interface Props {
  requiredProperty: number;
  optionalProperty?: boolean;
  snippetWithStringArgument: Snippet<[string]>;
}
let { requiredProperty, optionalProperty, snippetWithStringArgument }: Props = $props();
```
- Use `generics` attribute for generic props: `<script lang="ts" generics="Item extends { text: string }">`
- Type wrapper components with `HTMLButtonAttributes` from `svelte/elements`
- Use `Component` and `ComponentProps` types for dynamic components
- Augment `svelte/elements` module to add custom attributes/events

## Custom Elements

- Compile to web components with `<svelte:options customElement="my-element" />`
- Access host element via `$host` rune
- Properties exposed as both attributes and properties; use `MyElement.element` constructor
- Configure with object: `tag`, `shadow: "none"` (disables encapsulation), `props` (with `attribute`, `reflect`, `type`), `extend` (for lifecycle customization)
- Caveats: styles encapsulated in shadow DOM, inlined as JS strings, not SSR-suitable, slotted content renders eagerly, context not shared across elements

## Svelte 4 Migration

- Minimum: Node 16+, SvelteKit 1.20.4+, TypeScript 5+
- Bundlers must specify `browser` condition
- CommonJS output removed; use bundler for ESM-to-CJS conversion
- Stricter types: `createEventDispatcher` enforces payload requirements, `Action` defaults to `undefined` parameter
- Replace `<svelte:options tag="...">` with `<svelte:options customElement="...">`
- Replace `SvelteComponentTyped` with `SvelteComponent`
- Transitions local by default; use `|global` modifier for old behavior
- Slot bindings no longer shared between default and named slots
- Preprocessor execution order: markup → script → style; each must have a name
- Switch from `eslint-plugin-svelte3` to `eslint-plugin-svelte`

## Svelte 5 Migration

**Reactivity**: `let` → `$state()`, `$:` → `$derived()` or `$effect()`, `export let` → `$props()`

**Events**: `on:` directive → event attributes (e.g., `onclick`); replace `createEventDispatcher` with callback props

**Slots → Snippets**: Use `children` prop with `{@render}` for default content; named slots become snippet props

**Components**: Now functions, not classes. Use `mount(App, { target })` from `svelte`; replace `$set` with `$state` object, `$destroy` with `unmount()`

**Other**: `<svelte:component>` no longer needed; components dynamic by default. Requires modern browsers (Proxies, ResizeObserver). Run `npx sv migrate svelte-5` for automation.

## FAQ

- Interactive tutorial recommended for getting started
- Support: Stack Overflow (tag: svelte), Discord, Reddit
- Tooling: VS Code extension, Prettier with prettier-plugin-svelte
- Testing: Unit (Vitest), Component (jsdom + Vitest or browser-based), E2E (Playwright)
- Routing: SvelteKit is official router
- Mobile: SvelteKit SPA with Tauri or Capacitor
- Styling: Unused styles removed by compiler; use `:global(...)` for global styles