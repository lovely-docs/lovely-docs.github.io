

## Pages

### testing
Testing frameworks (Vitest, Storybook, Playwright) for unit, component, and E2E tests with setup, rune support in tests, component mounting, and interaction testing examples.

## Unit and Component Tests with Vitest

Install Vitest and configure `vite.config.js`:
```js
import { defineConfig } from 'vitest/config';
export default defineConfig({
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
```

Write unit tests for `.js/.ts` files:
```js
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
	double.set(5);
	expect(double.value).toEqual(10);
});
```

### Using Runes in Tests

Test files with `.svelte` in the filename can use runes:
```js
test('Multiplier', () => {
	let count = $state(0);
	let double = multiplier(() => count, 2);
	expect(double.value).toEqual(0);
	count = 5;
	expect(double.value).toEqual(10);
});
```

For tests using effects, wrap in `$effect.root` and use `flushSync()` to execute effects synchronously:
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

### Component Testing

Install jsdom and configure `vite.config.js`:
```js
export default defineConfig({
	test: { environment: 'jsdom' },
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
```

Test components using `mount` and `unmount`:
```js
import { flushSync, mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', () => {
	const component = mount(Component, {
		target: document.body,
		props: { initial: 0 }
	});
	expect(document.body.innerHTML).toBe('<button>0</button>');
	document.body.querySelector('button').click();
	flushSync();
	expect(document.body.innerHTML).toBe('<button>1</button>');
	unmount(component);
});
```

Use `@testing-library/svelte` for higher-level testing:
```js
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import Component from './Component.svelte';

test('Component', async () => {
	const user = userEvent.setup();
	render(Component);
	const button = screen.getByRole('button');
	expect(button).toHaveTextContent(0);
	await user.click(button);
	expect(button).toHaveTextContent(1);
});
```

For tests with two-way bindings, context, or snippet props, create a wrapper component.

## Component Tests with Storybook

Install Storybook via `npx sv add storybook`. Create stories and test interactions with the play function:
```svelte
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import LoginForm from './LoginForm.svelte';

	const { Story } = defineMeta({
		component: LoginForm,
		args: { onSubmit: fn() }
	});
</script>

<Story name="Empty Form" />

<Story
	name="Filled Form"
	play={async ({ args, canvas, userEvent }) => {
		await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
		await userEvent.type(canvas.getByTestId('password'), 'a-random-password');
		await userEvent.click(canvas.getByRole('button'));
		await expect(args.onSubmit).toHaveBeenCalledTimes(1);
		await expect(canvas.getByText('You're in!')).toBeInTheDocument();
	}}
/>
```

## End-to-End Tests with Playwright

Setup Playwright via Svelte CLI or `npm init playwright`. Configure `playwright.config.js`:
```js
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};
export default config;
```

Write E2E tests:
```js
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```

### typescript
TypeScript support via `lang="ts"` with type-only features by default; preprocessor setup for full TS; typing $props/$state, generics, wrapper components, Component type, and DOM type augmentation.

## Using TypeScript in Svelte Components

Add `lang="ts"` to script tags to enable TypeScript:

```svelte
<script lang="ts">
	let name: string = 'world';
	function greet(name: string) {
		alert(`Hello, ${name}!`);
	}
</script>

<button onclick={(e: Event) => greet(e.target.innerText)}>
	{name as string}
</button>
```

### Type-Only Features
By default, only type-only features are supported (type annotations, interfaces, generics). Features requiring TypeScript compiler output are not supported: enums, private/protected/public modifiers with initializers in constructors, and non-standard ECMAScript features.

### Preprocessor Setup
To use non-type-only features, configure a preprocessor in `svelte.config.js`:

```ts
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: vitePreprocess({ script: true }) };
export default config;
```

For SvelteKit/Vite: `npx sv create` or `npm create vite@latest` with `svelte-ts` option automatically includes `vitePreprocess()`.

For Rollup/Webpack: install `typescript` and `svelte-preprocess`, then configure in plugin settings.

### tsconfig.json Requirements
- `target`: at least `ES2015` (so classes aren't compiled to functions)
- `verbatimModuleSyntax`: `true` (keep imports as-is)
- `isolatedModules`: `true` (each file analyzed independently)

### Typing `$props`
Define props as an interface and destructure with `$props()`:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
		[key: string]: unknown;
	}

	let { requiredProperty, optionalProperty, snippetWithStringArgument, eventHandler, ...everythingElse }: Props = $props();
</script>

<button onclick={() => eventHandler('clicked button')}>
	{@render snippetWithStringArgument('hello')}
</button>
```

### Generic `$props`
Use `generics` attribute on script tag to declare generic relationships:

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}

	let { items, select }: Props = $props();
</script>

{#each items as item}
	<button onclick={() => select(item)}>
		{item.text}
	</button>
{/each}
```

### Typing Wrapper Components
Use `HTMLButtonAttributes` from `svelte/elements` for native element wrappers:

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>

<button {...rest}>
	{@render children?.()}
</button>
```

For elements without dedicated types, use `SvelteHTMLElements`:

```svelte
<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	let { children, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<div {...rest}>
	{@render children?.()}
</div>
```

### Typing `$state`
Type state variables normally. Without initial value, type includes `undefined`. Use `as` casting when value will be defined before use:

```ts
let count: number = $state(0);
let count: number = $state(); // Error: Type 'number | undefined' not assignable to 'number'

class Counter {
	count = $state() as number;
	constructor(initial: number) { this.count = initial; }
}
```

### Component Type
Use `Component` type to constrain dynamic components:

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		DynamicComponent: Component<{ prop: string }>;
	}

	let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent prop="foo" />
```

Extract component props with `ComponentProps`:

```ts
import type { Component, ComponentProps } from 'svelte';
import MyComponent from './MyComponent.svelte';

function withProps<TComponent extends Component<any>>(
	component: TComponent,
	props: ComponentProps<TComponent>
) {}

withProps(MyComponent, { foo: 'bar' });
```

Declare component constructor/instance types:

```svelte
<script lang="ts">
	import MyComponent from './MyComponent.svelte';
	let componentConstructor: typeof MyComponent = MyComponent;
	let componentInstance: MyComponent;
</script>

<MyComponent bind:this={componentInstance} />
```

### Enhancing Built-in DOM Types
Augment `svelte/elements` module for custom/experimental attributes and events:

```ts
/// file: additional-svelte-typings.d.ts
import { HTMLButtonAttributes } from 'svelte/elements';

declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}

	export interface HTMLAttributes<T> {
		globalattribute?: string;
	}

	export interface HTMLButtonAttributes {
		veryexperimentalattribute?: string;
	}
}

export {};
```

Reference the `.d.ts` file in `tsconfig.json` (e.g., `"include": ["src/**/*"]`).

### custom-elements
Compile Svelte components to web components with customElement option; configure tag, shadow DOM, prop reflection/types, and lifecycle via extend function; styles encapsulated and inlined; slotted content eager; context isolated per element.

## Compiling to Custom Elements

Svelte components can be compiled to web components using the `customElement: true` compiler option. Specify a tag name with `<svelte:options customElement="my-element">`.

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'world' } = $props();
</script>
<h1>Hello {name}!</h1>
<slot />
```

Inner components without a tag name remain regular Svelte components. The static `element` property contains the custom element constructor:

```js
import MyElement from './MyElement.svelte';
customElements.define('my-element', MyElement.element);
```

Once defined, use as regular DOM elements:

```js
document.body.innerHTML = `<my-element><p>Slotted content</p></my-element>`;
const el = document.querySelector('my-element');
console.log(el.name);
el.name = 'everybody';
```

All props must be explicitly declared—`let props = $props()` without declaring `props` in component options won't expose properties on the DOM element.

## Lifecycle

Custom elements wrap Svelte components. The inner component is created in the next tick after `connectedCallback`, not immediately. Properties assigned before DOM insertion are saved and applied on creation. Exported functions are only available after mounting; use the `extend` option to work around this. Shadow DOM updates happen in the next tick, allowing batching and preventing unmounting during DOM moves. The component is destroyed in the next tick after `disconnectedCallback`.

## Component Options

Define `customElement` as an object in `<svelte:options>` (Svelte 4+):

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
				randomIndex() {
					this.elementIndex = Math.random();
				}
			};
		}
	}}
/>
<script>
	let { elementIndex, attachedInternals } = $props();
	function check() {
		attachedInternals.checkValidity();
	}
</script>
```

Options:
- `tag: string`: Custom element tag name; auto-registers if set
- `shadow: "none"`: Disable shadow root (styles not encapsulated, slots unavailable)
- `props`: Modify property behavior per prop:
  - `attribute: string`: Custom attribute name (default: lowercase property name)
  - `reflect: boolean`: Reflect prop changes back to DOM (default: false)
  - `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'`: Type for attribute-to-prop conversion (default: String)
- `extend: function`: Receives custom element class, returns modified class for lifecycle customization or ElementInternals integration

TypeScript in `extend` requires `lang="ts"` on a script and only erasable syntax.

## Caveats

- Styles are encapsulated (unless `shadow: "none"`); global styles and `:global()` don't apply
- Styles are inlined as JavaScript strings, not extracted to .css
- Not suitable for server-side rendering (shadow DOM invisible until JS loads)
- Slotted content renders eagerly in DOM (always created even in `{#if}` blocks), unlike Svelte's lazy rendering
- `<slot>` in `{#each}` doesn't repeat slotted content
- `let:` directive has no effect
- Older browsers need polyfills
- Context feature works within custom elements but not across them
- Don't declare properties/attributes starting with `on` (interpreted as event listeners: `oneworld={true}` becomes `addEventListener('eworld', true)`)

### v4-migration-guide
Svelte 4 migration: Node 16+, TypeScript 5+, bundler browser condition required; removed CJS; stricter types for createEventDispatcher/Action/onMount; customElement replaces tag; SvelteComponentTyped→SvelteComponent; transitions local by default; preprocessor execution order changed; eslint-plugin-svelte3→eslint-plugin-svelte; svelte.JSX→svelteHTML namespace.

## Minimum version requirements
- Node 16+, SvelteKit 1.20.4+, vite-plugin-svelte 2.4.1+, webpack 5+ with svelte-loader 3.1.8+, rollup-plugin-svelte 7.1.5+, TypeScript 5+

## Browser conditions for bundlers
Bundlers must specify the `browser` condition. For Rollup: set `browser: true` in `@rollup/plugin-node-resolve`. For webpack: add `"browser"` to `conditionNames` array.

## Removal of CJS output
CommonJS format, `svelte/register` hook, and CJS runtime removed. Use a bundler to convert ESM to CJS if needed.

## Stricter types for Svelte functions

`createEventDispatcher` now enforces payload requirements:
```ts
const dispatch = createEventDispatcher<{
	optional: number | null;
	required: string;
	noArgument: null;
}>();
dispatch('optional'); // ok
dispatch('required'); // error: missing argument
dispatch('noArgument', 'surprise'); // error: cannot pass argument
```

`Action` and `ActionReturn` default to `undefined` parameter type - must specify generic if action receives parameters:
```ts
const action: Action<HTMLElement, string> = (node, params) => { ... }
```

`onMount` now errors if you return a function asynchronously (likely a bug):
```ts
// Wrong - cleanup not called
onMount(async () => {
	const something = await foo();
	return () => someCleanup();
});

// Correct - cleanup called
onMount(() => {
	foo().then(something => {...});
	return () => someCleanup();
});
```

## Custom Elements with Svelte
`tag` option deprecated, use `customElement` instead:
```svelte
<svelte:options customElement="my-component" />
```

## SvelteComponentTyped deprecated
Replace with `SvelteComponent`:
```ts
import { SvelteComponent } from 'svelte';
export class Foo extends SvelteComponent<{ aProp: string }> {}
```

When using as instance type, use `typeof SvelteComponent<any>`:
```ts
let component: typeof SvelteComponent<any>;
```

## Transitions are local by default
Transitions only play when direct parent control flow block is created/destroyed, not ancestor blocks. Use `|global` modifier for old behavior:
```svelte
{#if show}
	{#if success}
		<p in:slide|global>Success</p>
	{/if}
{/if}
```

## Default slot bindings
Default slot bindings no longer exposed to named slots:
```svelte
<Nested let:count>
	<p>{count}</p>
	<p slot="bar">{count}</p> <!-- count not available here -->
</Nested>
```

## Preprocessors
Execution order changed: preprocessors run in order, within each preprocessor: markup → script → style.
```js
preprocess: [
	mdsvex(mdsvexConfig),  // must come before vitePreprocess
	vitePreprocess()
]
```
Each preprocessor must have a name.

## New eslint package
`eslint-plugin-svelte3` deprecated. Use `eslint-plugin-svelte` instead.

## Other breaking changes
- `inert` attribute applied to outroing elements
- Runtime uses `classList.toggle(name, boolean)` - may need polyfill for old browsers
- Runtime uses `CustomEvent` constructor - may need polyfill for old browsers
- `StartStopNotifier` interface now requires update function in addition to set function
- `derived` throws error on falsy values instead of stores
- Type definitions for `svelte/internal` removed
- DOM node removal now batched, may affect event order with `MutationObserver`
- Global typings: migrate from `svelte.JSX` namespace to `svelteHTML` namespace and `svelte/elements` types

### v5-migration-guide
Svelte 5 migration: explicit reactivity runes ($state/$derived/$effect), event attributes replace on: directives with callback props, snippets replace slots, components are functions (mount/unmount), stricter HTML/attributes, modern browsers only, numerous breaking changes in runes mode.

## Reactivity Syntax Changes

**let → $state**: Variables are now explicitly reactive using the `$state` rune instead of implicit top-level reactivity.
```svelte
let count = $state(0);
```

**$: → $derived/$effect**: Reactive statements split into two runes:
- `$derived` for computed state: `const double = $derived(count * 2);`
- `$effect` for side effects: `$effect(() => { if (count > 5) alert('too high'); });`

**export let → $props**: Component properties use destructuring with `$props()`:
```svelte
let { optional = 'unset', required, class: klass, ...rest } = $props();
```
Handles renaming (via destructuring), rest props, and all props without special syntax.

## Event Changes

**on: directive → event attributes**: Event handlers are now properties without the colon:
```svelte
<button onclick={() => count++}>clicks: {count}</button>
// or with named function
function onclick() { count++; }
<button {onclick}>clicks: {count}</button>
```

**createEventDispatcher → callback props**: Components accept callback functions as props instead of emitting events:
```svelte
// Parent
<Pump inflate={(power) => { size += power; }} deflate={(power) => { size -= power; }} />

// Child
let { inflate, deflate } = $props();
<button onclick={() => inflate(power)}>inflate</button>
```

**Bubbling events**: Forward events via callback props:
```svelte
let { onclick } = $props();
<button {onclick}>click me</button>
```

**Event modifiers removed**: No `on:click|preventDefault`. Use wrapper functions or call methods directly:
```svelte
function once(fn) {
  return function (event) {
    if (fn) fn.call(this, event);
    fn = null;
  };
}
function preventDefault(fn) {
  return function (event) {
    event.preventDefault();
    fn.call(this, event);
  };
}
<button onclick={once(preventDefault(handler))}>...</button>
```

For `capture`, use `onclickcapture={...}`. For `passive`/`nonpassive`, use actions.

**Multiple event handlers**: Not allowed as duplicate attributes. Combine into one:
```svelte
<button onclick={(e) => { one(e); two(e); }}>...</button>
```

## Snippets Instead of Slots

**Default content**: Use `children` prop with `{@render children?.()}`:
```svelte
let { children } = $props();
{@render children?.()}
```

**Multiple placeholders**: Use named snippet props:
```svelte
let { header, main, footer } = $props();
<header>{@render header()}</header>
<main>{@render main()}</main>
<footer>{@render footer()}</footer>
```

**Passing data back up**: Snippets receive parameters:
```svelte
// Parent
<List items={['one', 'two', 'three']}>
  {#snippet item(text)}
    <span>{text}</span>
  {/snippet}
  {#snippet empty()}
    <span>No items yet</span>
  {/snippet}
</List>

// Child
let { items, item, empty } = $props();
{#if items.length}
  <ul>
    {#each items as entry}
      <li>{@render item(entry)}</li>
    {/each}
  </ul>
{:else}
  {@render empty?.()}
{/if}
```

## Migration Script

Run `npx sv migrate svelte-5` to automatically:
- Bump dependencies
- Migrate `let` → `$state`, `$:` → `$derived`/`$effect`
- Migrate `on:` → event attributes
- Migrate slots to snippets
- Migrate component instantiation

Manual cleanup needed for:
- `createEventDispatcher` (convert to callback props)
- `beforeUpdate`/`afterUpdate` (use `$effect.pre`/`$effect` + `tick`)
- `run` function from `svelte/legacy` (replace with `$effect`)
- Event modifier wrappers from `svelte/legacy`

## Components Are No Longer Classes

Use `mount`/`hydrate` instead of `new Component()`:
```svelte
import { mount } from 'svelte';
const app = mount(App, { target: document.getElementById("app") });
```

**Replacing class component methods**:
- `$on`: Use `events` option: `mount(App, { target, events: { event: callback } })`
- `$set`: Use `$state` object: `const props = $state({ foo: 'bar' }); mount(App, { target, props }); props.foo = 'baz';`
- `$destroy`: Use `unmount(app)`

**Fallback**: Use `createClassComponent` from `svelte/legacy` or set `compatibility.componentApi: 4` compiler option.

**Server-side rendering**: Use `render` function:
```svelte
import { render } from 'svelte/server';
const { html, head } = render(App, { props: { message: 'hello' }});
```

**Component typing**: Use `Component` type instead of `SvelteComponent`:
```ts
import type { Component } from 'svelte';
let C: Component<{ foo: string }> = $state(Math.random() ? ComponentA : ComponentB);
```

## Other Changes

**`<svelte:component>` no longer needed**: Components are now dynamic by default:
```svelte
let Thing = $state();
<Thing /> <!-- equivalent to <svelte:component this={Thing} /> -->
```

**Dot notation for components**: `<foo.bar>` now creates a component, not an element.

**Whitespace handling simplified**: Whitespace between nodes collapses to one, whitespace at tag start/end removed. Use `preserveWhitespace` option to disable.

**Modern browser required**: Uses Proxies, ResizeObserver, no IE support. `legacy` compiler option removed.

**Compiler option changes**: Removed `false`/`true`/`"none"` from `css`, removed `hydratable`, `enableSourcemap`, `tag`, `loopGuardTimeout`, `format`, `sveltePath`, `errorMode`, `varsReport`.

**`children` prop reserved**: Cannot have separate prop with this name.

## Breaking Changes in Runes Mode

**Bindings to component exports not allowed**: Use `bind:this` instead: `<A bind:this={a} />` then access `a.foo`.

**Bindings require `$bindable()`**: Properties not bindable by default:
```svelte
let { foo = $bindable('bar') } = $props();
```

**`accessors` option ignored**: Use component exports instead:
```svelte
let { name } = $props();
export const getName = () => name;
```

**`immutable` option ignored**: Replaced by `$state` behavior.

**Classes not auto-reactive**: Define reactive fields with `$state` on the class.

**Touch/wheel events passive**: `onwheel`, `onmousewheel`, `ontouchstart`, `ontouchmove` are passive by default. Use `on` action to prevent defaults.

**Stricter attribute syntax**: Complex values must be quoted: `<Component prop="this{is}valid" />`.

**Stricter HTML structure**: Browser auto-repair no longer allowed; compiler throws error.

**`@const` assignment validation stricter**: Destructured assignments to `@const` parts not allowed.

**`:is()`, `:has()`, `:where()` scoped**: Use `:global()` inside them if needed.

**CSS hash position non-deterministic**: No longer always last.

**Scoped CSS uses `:where()`**: Selectors use `:where(.svelte-xyz123)` for specificity control.

**Error/warning codes renamed**: Use underscores instead of dashes (e.g., `foo_bar`).

**Reduced namespaces**: Only `html`, `mathml`, `svg` valid.

**`beforeUpdate`/`afterUpdate` changes**: No longer runs twice on initial render if modifying template variables. Parent `afterUpdate` runs after child. Don't run when slot content updates. Disallowed in runes mode.

**`contenteditable` binding behavior**: Binding takes full control; reactive values inside won't update.

**`oneventname` attributes no longer accept strings**: `<button onclick="alert('hello')">` invalid.

**`null`/`undefined` become empty string**: Instead of printing as strings.

**`bind:files` stricter**: Only accepts `null`, `undefined`, or `FileList`.

**Bindings react to form resets**: Reset listeners placed on document.

**`walk` not exported**: Import from `estree-walker` directly.

**`<svelte:options>` content forbidden**: Compiler error if content inside.

**`<slot>` in shadow roots preserved**: Not replaced in `<template shadowrootmode="...">`.

**`<svelte:element this="...">` must be expression**: `<svelte:element this="div">` invalid; use `<svelte:element this={"div"}>`.

**`mount` plays transitions by default**: Unless `intro: false` option set.

**`<img src={...}>` and `{@html ...}` hydration mismatches not repaired**: Warns in dev but doesn't fix. Force update by toggling values in `$effect`.

**Hydration uses comments**: Don't remove comments from server-rendered HTML. Manually authored HTML needs comments at correct positions.

**`onevent` attributes delegated**: Don't manually stop propagation on delegated events.

**`--style-props` uses `<svelte-css-wrapper>`**: Instead of `<div>`.

### faq
FAQ covering getting started (tutorial), support channels, tooling (VS Code, prettier), component documentation syntax, testing strategies (unit/component/E2E), routing (SvelteKit), mobile development (Tauri/Capacitor), style scoping with :global(), and HMR setup.

## Getting Started
Start with the interactive tutorial at /tutorial. Each step focuses on one aspect. 5-10 minutes to get running, 1.5 hours for the full tutorial.

## Support Resources
- Reference docs at /docs/svelte for syntax questions
- Stack Overflow for code-level questions (tag: svelte)
- Discord or Reddit for discussions about best practices and architecture
- Svelte Society maintains a list of books and videos at sveltesociety.dev/resources

## Tooling
- VS Code: Use the official Svelte extension (svelte.svelte-vscode)
- Formatting: Use prettier with prettier-plugin-svelte

## Component Documentation
Use specially formatted comments in editors with Svelte Language Server:
```svelte
<script>
	/** What should we call the user? */
	export let name = 'world';
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```svelte
  <main name="Arethra">
  ```
-->
<main>
	<h1>Hello, {name}</h1>
</main>
```
Note: The `@component` tag is required in the HTML comment.

## Scaling
Check GitHub issue #2546 for discussion on Svelte's scalability.

## UI Component Libraries
Several UI component libraries and standalone components are listed on the packages page.

## Testing
Three types of tests for Svelte applications:

**Unit Tests**: Test business logic in isolation using test runners like Vitest. Extract logic from components to maximize coverage.

**Component Tests**: Validate component mounting and lifecycle using DOM tools. Options include jsdom + Vitest, Playwright, or Cypress.

**End-to-End Tests**: Test the full application in production-like conditions. Playwright is recommended for new SvelteKit projects.

Resources:
- Svelte docs on testing at /docs/svelte/testing
- Setup Vitest via Svelte CLI at /docs/cli/vitest
- Svelte Testing Library
- Cypress component testing for Svelte
- uvu test runner with JSDOM example
- Vitest & Playwright testing guide
- WebdriverIO component testing

## Routing
Official router: SvelteKit at /docs/kit. Provides filesystem routing, SSR, and HMR. Similar to Next.js (React) and Nuxt.js (Vue). Other routers available on packages page.

## Mobile Apps
- Turn a SvelteKit SPA into a mobile app with Tauri or Capacitor
- Mobile features (camera, geolocation, push notifications) available via plugins
- Custom renderer support in progress for Svelte 5 (not yet available)
- Svelte Native (for NativeScript) was available in Svelte 4 but not Svelte 5

## Unused Styles
Svelte removes unused styles to prevent scoping issues. Styles are scoped by adding a unique class to elements. If Svelte can't identify what a selector applies to at compile time, it can't safely keep it.

Use `:global(...)` to explicitly opt into global styles. Partial global selectors work: `.foo :global(.bar) { ... }` styles `.bar` elements within `.foo`.

## Svelte v2
No new features. Bugs fixed only if critical or security-related. Documentation available at v2.svelte.dev/guide.

## Hot Module Reloading
Use SvelteKit (built on Vite and svelte-hmr) for HMR out of the box. Community plugins available for rollup and webpack.

