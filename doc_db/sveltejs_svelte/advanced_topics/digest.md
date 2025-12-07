## Testing Frameworks

**Vitest for unit/component tests**: Install Vitest, configure `vite.config.js` with `resolve.conditions: ['browser']` for VITEST environment. Write tests for `.js/.ts` files and `.svelte` files (which support runes).

For unit tests with runes:
```js
test('Multiplier', () => {
	let count = $state(0);
	let double = multiplier(() => count, 2);
	expect(double.value).toEqual(0);
	count = 5;
	expect(double.value).toEqual(10);
});
```

For effects, wrap in `$effect.root()` and use `flushSync()` to execute synchronously:
```js
test('Effect', () => {
	const cleanup = $effect.root(() => {
		let count = $state(0);
		let log = logger(() => count);
		flushSync();
		expect(log).toEqual([0]);
		count = 1;
		flushSync();
		expect(log).toEqual([0, 1]);
	});
	cleanup();
});
```

**Component testing**: Install jsdom, configure `test: { environment: 'jsdom' }`. Use `mount(Component, { target, props })` and `unmount(component)` from svelte, or use `@testing-library/svelte` for higher-level testing with `render()`, `screen`, and `userEvent`.

**Storybook**: Install via `npx sv add storybook`. Define stories with `defineMeta()`, test interactions with `play` function using `userEvent` and assertions.

**Playwright for E2E**: Configure `playwright.config.js` with `webServer` (build/preview commands), `testDir`, and `testMatch`. Write tests with `page.goto()`, `page.locator()`, and assertions.

## TypeScript Support

Add `lang="ts"` to script tags. By default, only type-only features work (annotations, interfaces, generics). For non-type-only features (enums, modifiers with initializers), configure preprocessor in `svelte.config.js`:
```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default { preprocess: vitePreprocess({ script: true }) };
```

**tsconfig.json requirements**: `target: ES2015+`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

**Typing $props**: Define interface and destructure:
```svelte
<script lang="ts">
	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
		[key: string]: unknown;
	}
	let { requiredProperty, optionalProperty, snippetWithStringArgument, eventHandler, ...everythingElse } = $props();
</script>
```

**Generic $props**: Use `generics` attribute on script tag:
```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select } = $props();
</script>
```

**Wrapper components**: Use `HTMLButtonAttributes` from `svelte/elements` for native elements, or `SvelteHTMLElements['div']` for others.

**Typing $state**: Type normally; without initial value, type includes `undefined`. Use `as` casting when value will be defined before use:
```ts
let count: number = $state(0);
class Counter {
	count = $state() as number;
	constructor(initial: number) { this.count = initial; }
}
```

**Component type**: Use `Component` type to constrain dynamic components. Extract props with `ComponentProps<TComponent>`. Declare instance types with `bind:this={componentInstance}`.

**DOM type augmentation**: Create `.d.ts` file and declare module `svelte/elements` to add custom attributes/events to `SvelteHTMLElements`, `HTMLAttributes`, or specific element attributes.

## Custom Elements (Web Components)

Compile Svelte components to web components with `<svelte:options customElement="my-element">`. Access constructor via `MyElement.element` property.

**Component options** (Svelte 4+): Define `customElement` as object:
```svelte
<svelte:options
	customElement={{
		tag: 'custom-element',
		shadow: 'none',
		props: {
			name: { reflect: true, type: 'Number', attribute: 'element-index' }
		},
		extend: (customElementConstructor) => {
			return class extends customElementConstructor {
				static formAssociated = true;
				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
				}
			};
		}
	}}
/>
```

Options: `tag` (auto-registers), `shadow: 'none'` (disables encapsulation), `props` (per-prop: `attribute`, `reflect`, `type`), `extend` (customize lifecycle/add ElementInternals).

**Lifecycle**: Inner component created in next tick after `connectedCallback`. Properties assigned before DOM insertion are saved. Exported functions available after mounting. Shadow DOM updates batched in next tick. Component destroyed in next tick after `disconnectedCallback`.

**Caveats**: Styles encapsulated/inlined (not extracted to .css). Slotted content renders eagerly. `<slot>` in `{#each}` doesn't repeat. `let:` directive has no effect. Context works within custom elements but not across them. Don't declare properties starting with `on` (interpreted as event listeners).

## Svelte 4 Migration

**Minimum versions**: Node 16+, TypeScript 5+, bundlers must specify `browser` condition.

**Removed CJS**: CommonJS format, `svelte/register`, and CJS runtime removed.

**Stricter types**: `createEventDispatcher` enforces payload requirements. `Action`/`ActionReturn` default to `undefined` parameter type. `onMount` errors if returning function asynchronously.

**Custom elements**: `tag` option deprecated, use `customElement` instead.

**SvelteComponentTyped deprecated**: Use `SvelteComponent` instead.

**Transitions local by default**: Only play when direct parent control flow block created/destroyed. Use `|global` modifier for old behavior.

**Default slot bindings**: No longer exposed to named slots.

**Preprocessors**: Execution order changed (preprocessors run in order, within each: markup → script → style). Each preprocessor must have a name.

**Other changes**: `eslint-plugin-svelte3` → `eslint-plugin-svelte`. `inert` applied to outroing elements. Runtime uses `classList.toggle(name, boolean)` and `CustomEvent` constructor. `derived` throws on falsy values. DOM removal batched. Migrate from `svelte.JSX` to `svelteHTML` namespace.

## Svelte 5 Migration

**Reactivity**: `let` → `$state()`, `$:` → `$derived()` (computed) or `$effect()` (side effects).

**Props**: `export let` → destructure with `$props()`:
```svelte
let { optional = 'unset', required, class: klass, ...rest } = $props();
```

**Events**: `on:` directive → event attributes (properties):
```svelte
<button onclick={() => count++}>clicks: {count}</button>
```

`createEventDispatcher` → callback props:
```svelte
// Parent
<Pump inflate={(power) => { size += power; }} />
// Child
let { inflate } = $props();
<button onclick={() => inflate(power)}>inflate</button>
```

Event modifiers removed; use wrapper functions or call methods directly. Multiple handlers not allowed as duplicate attributes; combine into one. `capture` via `onclickcapture`, `passive`/`nonpassive` via actions.

**Snippets replace slots**: Use `children` prop with `{@render children?.()}` for default content. Named snippet props for multiple placeholders. Snippets receive parameters to pass data back up.

**Components are functions**: Use `mount(App, { target })` instead of `new Component()`. Use `unmount(app)` instead of `$destroy()`. Replace `$on` with `events` option, `$set` with `$state` object. Use `render()` function for SSR. Use `Component` type instead of `SvelteComponent`.

**Other changes**: `<svelte:component>` no longer needed (components dynamic by default). Dot notation creates components. Whitespace handling simplified. Modern browsers only (Proxies, ResizeObserver). `children` prop reserved. Bindings require `$bindable()`. `accessors` option ignored. Classes not auto-reactive. Touch/wheel events passive by default. Stricter attribute/HTML syntax. `:is()`, `:has()`, `:where()` scoped. Scoped CSS uses `:where()`. `beforeUpdate`/`afterUpdate` behavior changed. `contenteditable` binding takes full control. `oneventname` attributes don't accept strings. `null`/`undefined` become empty string. `bind:files` stricter. Bindings react to form resets. `<svelte:element this="...">` must be expression. `mount` plays transitions by default. Hydration uses comments. `onevent` attributes delegated.

Run `npx sv migrate svelte-5` for automatic migration.

## FAQ

**Getting started**: Interactive tutorial at /tutorial (5-10 min to run, 1.5 hours full).

**Support**: Stack Overflow (tag: svelte), Discord, Reddit, Svelte Society resources.

**Tooling**: VS Code extension (svelte.svelte-vscode), prettier with prettier-plugin-svelte.

**Component documentation**: Use JSDoc comments with `@component` tag in HTML comment for hover documentation in editors with Svelte Language Server.

**Testing**: Unit tests (business logic), component tests (mounting/lifecycle), E2E tests (full app). Vitest recommended for unit/component, Playwright for E2E.

**Routing**: Official router is SvelteKit (filesystem routing, SSR, HMR). Other routers available.

**Mobile**: Tauri or Capacitor to turn SvelteKit SPA into mobile app. Mobile features via plugins.

**Unused styles**: Svelte removes unused styles by scoping with unique class. Use `:global(...)` for global styles. Partial global selectors work: `.foo :global(.bar)`.

**HMR**: SvelteKit (built on Vite/svelte-hmr) has HMR out of box. Community plugins for rollup/webpack.