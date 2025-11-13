
## Directories

### introduction
Svelte is a compiler framework for building UIs with components that combine HTML, CSS, and JavaScript, with setup via SvelteKit or Vite.

## Overview

Svelte is a compiler-based framework that transforms declarative components into optimized JavaScript. Components are written in `.svelte` files combining HTML, CSS, and JavaScript.

## Setup

**SvelteKit (recommended):**
```sh
npx sv create myapp
cd myapp
npm run dev
```

**Vite:**
```sh
npm create vite@latest
npm run build
```

## Component Structure

`.svelte` files contain three optional sections:

```svelte
<script module>
	// runs once at module load
</script>

<script>
	// runs per component instance
	let count = 0;
</script>

<button onclick={() => count++}>{count}</button>

<style>
	button { font-size: 2em; }
</style>
```

- `<script>`: Instance-level logic; top-level variables accessible in markup
- `<script module>`: Module-level logic; can export bindings (not default export)
- `<style>`: Scoped CSS affecting only this component

## Reactive Modules

`.svelte.js` and `.svelte.ts` files support Svelte runes for reusable reactive logic and state sharing across the application (introduced in Svelte 5).

## Resources

- Interactive tutorial for learning
- VS Code extension for editor support
- Playground and StackBlitz for online environments
- Discord and Stack Overflow for help

### runes
Compiler-controlled `$`-prefixed keywords that manage reactive state, derived values, side effects, component inputs, and debugging in Svelte.

## Runes

Runes are `$`-prefixed compiler keywords in Svelte that control reactivity and side effects. They are not regular functions and require no imports.

### $state
Creates reactive state. Arrays and objects become deeply reactive proxies:
```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

Variants:
- `$state.raw` — non-reactive, only reassignable
- `$state.snapshot` — static snapshot of a proxy
- `$state.eager` — force immediate updates for `await` expressions

Cannot directly export reassigned state; export objects or accessor functions instead.

### $derived
Reactive computed values that auto-update when dependencies change:
```js
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by()` for complex logic. Derived values can be temporarily reassigned for optimistic UI. Unlike `$state`, not deeply reactive proxies.

### $effect
Runs side effects when state updates, automatically tracking synchronous dependencies:
```js
$effect(() => {
	const interval = setInterval(() => count += 1, 1000);
	return () => clearInterval(interval); // teardown
});
```

Variants:
- `$effect.pre` — runs before DOM updates
- `$effect.tracking()` — returns whether in tracking context
- `$effect.root()` — manually controlled scope outside component initialization

Don't use effects to synchronize state; use `$derived` instead.

### $props
Receives component inputs with destructuring, defaults, and renaming:
```js
let { adjective = 'happy', super: trouper = 'lights' } = $props();
let { a, b, ...others } = $props(); // rest props
```

Add type annotations for safety. `$props.id()` generates unique IDs per instance.

### $bindable
Marks props as bindable for bidirectional data flow:
```js
// Child
let { value = $bindable() } = $props();

// Parent
<FancyInput bind:value={message} />
```

### $inspect
Development-only debugging rune that logs when arguments change:
```js
$inspect(count, message).with((type, count) => {
	if (type === 'update') debugger;
});
```

`$inspect.trace()` traces which reactive state caused an effect/derived to re-run.

### $host
Provides access to the host element in custom element components:
```js
$host().dispatchEvent(new CustomEvent('increment'));
```

### template_syntax
Complete reference for Svelte template syntax covering markup, attributes, events, control flow, snippets, directives, and special tags.

## Markup & Attributes
HTML tags are lowercase, components are capitalized or use dot notation. Attributes accept unquoted values, expressions, or pure expressions. Boolean attributes include if truthy, exclude if falsy. Shorthand `{name}` replaces `name={name}`. Spread attributes with `{...object}` override in order.

## Events & Text
Listen to DOM events with `on` prefix (case-sensitive: `onclick` vs `onClick`). Delegated events require `bubbles: true` when dispatching manually. Text expressions use `{expression}` syntax; null/undefined omit, others coerce to strings. Use `{@html string}` for raw HTML (ensure safe). HTML comments work normally; `<!-- svelte-ignore a11y_autofocus -->` disables warnings.

## Conditional & Iteration
`{#if condition}...{:else if}...{:else}...{/if}` for conditional rendering. `{#each items as item, i (key)}...{:else}...{/each}` for iteration with optional keying, destructuring, and else fallback. `{#key expression}` destroys/recreates contents when expression changes.

## Async & Promises
`{#await promise}pending{:then value}fulfilled{:catch error}rejected{/await}` handles Promise states. Omit branches as needed. Only pending renders during SSR.

## Snippets & Rendering
`{#snippet name(params)}...{/snippet}` defines reusable markup blocks with parameters and default values. `{@render snippet()}` renders snippets; use optional chaining `{@render snippet?.()}` for optional snippets. Snippets passed as props become component props; non-snippet content becomes `children` snippet.

## Directives
`bind:property={value}` enables two-way binding on inputs, selects, media, and component props (mark props with `$bindable()`). `use:action={params}` attaches lifecycle-managed functions to elements. `transition:name={params}` animates elements entering/leaving DOM; use `|global` modifier for parent block changes. `in:` and `out:` apply non-bidirectional transitions. `animate:name={params}` triggers animations when keyed each items reorder. `style:property={value}` sets inline styles with `|important` modifier. `class:name={condition}` conditionally applies classes; `class` attribute accepts objects/arrays for combining classes.

## Special Tags
`{@const name = value}` defines block-scoped constants. `{@debug var1, var2}` logs variables on change and pauses if devtools open. `{@attach function}` runs functions on element mount with optional cleanup. `{@render snippet()}` renders snippets.

## Experimental: Await Expressions
Enable with `experimental.async: true`. Use `await` in component scripts, `$derived()`, and markup for synchronized updates. `$effect.pending()` detects async work; `settled()` waits for completion. `fork()` preloads expected await expressions.

### styling
Component styling with automatic scoping, global style options, CSS custom properties, and nested style behavior.

## Scoped Styles

Svelte automatically scopes component styles using hash-based classes (e.g., `svelte-123xyz`) to prevent style leakage. Scoped selectors receive a specificity increase of 0-1-0, allowing them to override global styles. When the scoping class appears multiple times, subsequent occurrences use `:where()` to avoid further specificity increases. Keyframe names are also scoped automatically.

## Global Styles

Use `:global(selector)` to apply styles globally:

```svelte
<style>
	:global(body) { margin: 0; }
	div :global(strong) { color: goldenrod; }
</style>
```

Use `:global {...}` blocks for multiple selectors or `:global` in selector chains:

```svelte
<style>
	:global {
		div { ... }
		p { ... }
	}
	.a :global .b .c { ... }
</style>
```

For global keyframes, prefix with `-global-`:

```svelte
@keyframes -global-my-animation { /* ... */ }
```

## CSS Custom Properties

Pass custom properties to components using `--property-name` syntax:

```svelte
<Slider --track-color="black" --thumb-color="rgb({r} {g} {b})" />
```

Read them inside the component with `var()`:

```svelte
<style>
	.track { background: var(--track-color, #aaa); }
</style>
```

Custom properties can be inherited from parent elements or defined globally on `:root`.

## Nested Style Elements

Nested `<style>` tags inside elements or logic blocks bypass scoping and apply globally to the DOM without processing.

### special_elements
Special elements for error handling, global object access, dynamic rendering, and component configuration.

## Special Elements

Svelte provides special elements for managing errors, accessing global objects, and rendering dynamic content.

### `<svelte:boundary>`
Error boundary and async state management. Catches rendering and effect errors, shows fallback UI, and handles pending states during async operations.

```svelte
<svelte:boundary onerror={(error, reset) => report(error)}>
	<FlakyComponent />
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
	{#snippet failed(error, reset)}
		<button onclick={reset}>retry</button>
	{/snippet}
</svelte:boundary>
```

Only catches errors during rendering and effects, not in event handlers or async callbacks. Available since Svelte 5.3.0.

### `<svelte:window>`
Attaches event listeners to `window` with automatic cleanup. Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`.

```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

### `<svelte:document>`
Attaches event listeners and actions to `document`. Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`.

```svelte
<svelte:document onvisibilitychange={handler} use:someAction />
```

### `<svelte:body>`
Attaches event listeners and actions to `document.body`.

```svelte
<svelte:body onmouseenter={handleMouseenter} use:someAction />
```

### `<svelte:head>`
Inserts content into `document.head`. During SSR, head content is exposed separately.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="..." />
</svelte:head>
```

### `<svelte:element>`
Renders a DOM element with runtime-determined tag name via the `this` prop. If `this` is nullish, nothing renders. Only `bind:this` binding is supported.

```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg">
	Content
</svelte:element>
```

### `<svelte:options>`
Configures per-component compiler options: `runes`, `namespace`, `customElement`, `css`.

```svelte
<svelte:options customElement="my-element" namespace="svg" />
```

All special elements except `<svelte:options>` must appear only at the top level of a component.

### runtime_apis
Core runtime APIs for state management (stores, context), component lifecycle, and imperative component mounting/rendering.

## Stores

Reactive state management via `svelte/store`. Access values with `$` prefix for automatic subscription.

**writable(initialValue, onSubscribe?)** - Creates mutable store with `.set()` and `.update()` methods.
```js
const count = writable(0);
count.set(1);
count.update(n => n + 1);
```

**readable(initialValue, onSubscribe)** - Read-only store with callback receiving `set` function.
```js
const time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
```

**derived(store(s), callback, initialValue?)** - Derives from one or more stores.
```js
const doubled = derived(a, ($a) => $a * 2);
const summed = derived([a, b], ([$a, $b]) => $a + $b);
```

**readonly(store)** - Wraps store as read-only. **get(store)** - Retrieves value synchronously.

Custom stores require `.subscribe(subscription)` method returning unsubscribe function, and optional `.set(value)`.

## Context

Parent-to-child value passing without prop-drilling via `setContext`/`getContext`.

```svelte
<script>
	import { setContext, getContext } from 'svelte';
	setContext('my-context', 'value');
	const value = getContext('my-context');
</script>
```

Store reactive state in context by mutating objects rather than reassigning. Use `createContext` for type-safe context:
```ts
export const [getUserContext, setUserContext] = createContext<User>();
```

Available: `setContext`, `getContext`, `hasContext`, `getAllContexts`.

## Lifecycle Hooks

**onMount** - Runs after component mounts to DOM. Can return cleanup function.
```js
onMount(() => {
	const interval = setInterval(() => {}, 1000);
	return () => clearInterval(interval);
});
```

**onDestroy** - Runs before unmount. Only hook that runs in SSR.

**tick** - Returns promise resolving after pending state changes apply to DOM.
```js
await tick();
```

Replace deprecated `beforeUpdate`/`afterUpdate` with `$effect.pre` and `$effect`.

## Imperative Component API

**mount(Component, { target, props })** - Instantiate and mount component to DOM element.

**unmount(component, { outro })** - Remove mounted component. Returns promise if `outro: true`.

**render(Component, { props })** - Server-only SSR function returning `{ body, head }`.

**hydrate(Component, { target, props })** - Mount component reusing SSR HTML output.

### advanced_topics_&_migration
Advanced patterns, testing strategies, TypeScript integration, custom elements, and migration guides for Svelte 4 and 5.

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

### api_reference
Complete reference of Svelte 5 runtime APIs, compiler functions, and utility modules for component lifecycle, state management, animations, stores, and server-side rendering.

## Core Runtime API

**Component Lifecycle & Mounting**
- `mount(component, options)` - Mount component to target, returns exports. Plays transitions by default unless `intro: false`
- `hydrate(component, options)` - Hydrate component on target
- `unmount(component, options)` - Unmount component with optional outro transitions

**Lifecycle Hooks**
- `onMount(fn)` - Runs after component mounts to DOM. Returned function runs on unmount. Doesn't run during SSR
- `onDestroy(fn)` - Runs before unmount. Only hook that runs during SSR
- `beforeUpdate(fn)` - Deprecated, use `$effect.pre` instead
- `afterUpdate(fn)` - Deprecated, use `$effect` instead

**State & Effects**
- `tick()` - Returns promise resolving once pending state changes apply
- `settled()` - Returns promise resolving once state changes, async work, and DOM updates complete
- `flushSync(fn?)` - Synchronously flush pending updates
- `untrack(fn)` - Prevents state reads inside `fn` from becoming dependencies in `$derived` or `$effect`
- `getAbortSignal()` - Returns AbortSignal that aborts when derived/effect re-runs or destroys

**Context**
- `setContext(key, context)` - Associate context with current component
- `getContext(key)` - Retrieve context from closest parent. Must be called during initialization
- `getAllContexts()` - Get entire context map from closest parent
- `hasContext(key)` - Check if key exists in parent context
- `createContext()` - Type-safe alternative returning `[get, set]` pair

**Events**
- `createEventDispatcher()` - Deprecated, use callback props or `$host()` instead

**Snippets**
- `createRawSnippet(fn)` - Create snippet programmatically. Function receives getters for params and returns `{ render: () => string, setup?: (element) => void | cleanup }`

**Advanced**
- `fork(fn)` - Create fork where state changes evaluate but don't apply to DOM. Returns Fork with `commit()` and `discard()` methods

**Types**
- `Component<Props, Exports, Bindings>` - Type for strongly-typed Svelte components
- `ComponentProps<Comp>` - Extract props type from component
- `Snippet<Parameters>` - Type for snippet blocks
- `MountOptions<Props>` - Options for `mount()` function

## Actions

Type actions using `Action` interface:
```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {
	// ...
}
```

Actions can return `ActionReturn` with optional `update` and `destroy` methods. Third generic parameter defines additional attributes/events the action enables.

## Animations

**flip** - Animates element between start and end positions using FLIP (First, Last, Invert, Play):
```js
import { flip } from 'svelte/animate';
function flip(node: Element, { from, to }: { from: DOMRect; to: DOMRect }, params?: FlipParams): AnimationConfig;
```

AnimationConfig: `delay`, `duration`, `easing`, `css(t, u)`, `tick(t, u)`

## Attachments

**createAttachmentKey** - Creates symbol key for programmatic attachment creation. When spread onto element, recognized as attachment:
```js
const props = {
  [createAttachmentKey()]: (node) => { node.textContent = 'attached!'; }
};
```

**fromAction** - Converts action into attachment with identical behavior:
```js
<div {@attach fromAction(foo, () => bar)}>...</div>
```

Attachment is function that runs when element mounts to DOM and optionally returns cleanup function called on unmount.

## Compiler API

**compile(source, options)** - Converts `.svelte` source to JavaScript module. Returns `CompileResult` with `js`, `css`, `warnings`, `metadata`, `ast`

**compileModule(source, options)** - Compiles JavaScript source containing runes into module. Always operates in runes mode

**parse(source, options)** - Parses component and returns AST. Supports both modern and legacy formats via `modern` option

**preprocess(source, preprocessor, options)** - Applies preprocessor hooks to transform source. Accepts single or array of `PreprocessorGroup`. Returns `Promise<Processed>`

**migrate(source, options)** - Performs best-effort migration to runes, event attributes, and render tags

**VERSION** - Current version string

Key compile options: `name`, `customElement`, `generate` ('client'|'server'|false), `dev`, `css` ('injected'|'external'), `runes`, `namespace`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `hmr`, `modernAst`

## Easing Functions

`svelte/easing` provides: `linear`, `quadIn/Out/InOut`, `cubicIn/Out/InOut`, `quartIn/Out/InOut`, `quintIn/Out/InOut`, `sineIn/Out/InOut`, `expoIn/Out/InOut`, `circIn/Out/InOut`, `backIn/Out/InOut`, `bounceIn/Out/InOut`, `elasticIn/Out/InOut`

Each accepts normalized time `t` (0 to 1) and returns eased value.

## Event Handling

**on(element, type, handler, options?)** - Attaches event handler to DOM elements and returns removal function. Preserves correct handler execution order relative to declarative handlers:
```js
import { on } from 'svelte/events';
const unsubscribe = on(window, 'resize', (event) => { console.log('resized'); });
```

## Legacy Utilities

`svelte/legacy` provides deprecated migration functions:
- Component: `asClassComponent(component)`, `createClassComponent(options)`
- Events: `handlers()`, `once(fn)`, `preventDefault(fn)`, `stopPropagation(fn)`, `stopImmediatePropagation(fn)`, `self(fn)`, `trusted(fn)`
- Actions: `passive(node, [event, handler])`, `nonpassive(node, [event, handler])`
- Other: `createBubbler()`, `run(fn)`

## Motion

**Spring** - Animates values with spring physics. Changes to `spring.target` smoothly move `spring.current`:
```js
const spring = new Spring(0);
spring.target = 100;
spring.set(value, options); // options: instant, preserveMomentum
```

**Tween** - Animates values over fixed duration. Changes to `tween.target` move `tween.current`:
```js
const tween = new Tween(0);
tween.target = 100;
tween.set(value, options);
```

**prefersReducedMotion** - Media query detecting user preference for reduced motion. Use to conditionally disable animations

## Reactive Window Values

`svelte/reactivity/window` exports reactive wrappers with `.current` property:
- `innerWidth.current`, `innerHeight.current` - viewport dimensions
- `outerWidth.current`, `outerHeight.current` - window dimensions
- `scrollX.current`, `scrollY.current` - scroll position
- `screenLeft.current`, `screenTop.current` - window position
- `devicePixelRatio.current` - pixel ratio
- `online.current` - network status

All undefined on server.

## Reactive Built-ins

`svelte/reactivity` provides reactive versions of standard objects:
- **SvelteMap** - Reactive Map. Reading via iteration, `size`, `get()`, `has()` triggers reactivity
- **SvelteSet** - Reactive Set. Reading via iteration, `size`, `has()` triggers reactivity
- **SvelteDate** - Reactive Date. Reading via methods like `getTime()`, `toString()` triggers reactivity
- **SvelteURL** - Reactive URL. Reading properties like `href`, `pathname`, `protocol`, `hostname` triggers reactivity
- **SvelteURLSearchParams** - Reactive URLSearchParams. Reading via iteration, `get()`, `getAll()` triggers reactivity
- **MediaQuery** - Creates media query with `current` property reflecting match status

**createSubscriber** - Returns `subscribe` function integrating external event systems with Svelte reactivity. When called inside effect, `start` callback receives `update` function that re-runs effect when called. If `start` returns cleanup function, it's called when effect destroys.

## Server-Side Rendering

**render(component, options?)** - Server-only function rendering Svelte components to HTML. Available when compiling with `server` option:
```js
const { body, head } = render(MyComponent, {
  props: { title: 'Hello' },
  context: new Map([['theme', 'dark']])
});
```

## Stores

**writable** - Create store with read and write capabilities:
```js
const count = writable(0);
count.subscribe(value => console.log(value));
count.set(1);
count.update(n => n + 1);
```

**readable** - Create read-only store with optional start/stop callbacks:
```js
const time = readable(new Date(), set => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});
```

**derived** - Create store computed from source stores:
```js
const doubled = derived(count, $count => $count * 2);
const sum = derived([a, b], ([$a, $b], set) => { set($a + $b); });
```

**get** - Retrieve current store value synchronously: `const value = get(myStore);`

**readonly** - Wrap store to expose only read interface

**fromStore** - Convert store to reactive object with `.current` property

**toStore** - Convert getter/setter functions into store

## Transitions

Built-in transition functions:
- **blur** - Animates blur filter and opacity. Params: `delay`, `duration`, `easing`, `amount`, `opacity`
- **fade** - Animates opacity. Params: `delay`, `duration`, `easing`
- **fly** - Animates x, y position and opacity. Params: `delay`, `duration`, `easing`, `x`, `y`, `opacity`
- **scale** - Animates opacity and scale. Params: `delay`, `duration`, `easing`, `start`, `opacity`
- **slide** - Slides element in/out along axis. Params: `delay`, `duration`, `easing`, `axis` ('x'|'y')
- **draw** - Animates SVG stroke like drawing. Works with `<path>`, `<polyline>`. Params: `delay`, `speed`, `duration`, `easing`
- **crossfade** - Creates paired `send` and `receive` transitions morphing elements between positions. Accepts `fallback` transition. Params: `delay`, `duration`, `easing`

All return `TransitionConfig` with optional `delay`, `duration`, `easing`, `css(t, u)`, `tick(t, u)`.

## Error & Warning Reference

Comprehensive reference for all Svelte compiler and runtime errors and warnings organized by category:

**Client-Side Errors**: Reactivity & state, effects, binding, components & lifecycle, other
**Client-Side Warnings**: Assignment, await, console, hydration, transitions
**Compiler Errors**: Animation, attributes, binding, blocks, const tag, declarations, CSS, derived/export, each block, effect, event handler, props, rune, snippet, state, Svelte meta elements, Svelte options, textarea, transition, parsing
**Compiler Warnings**: Accessibility (a11y_*), code quality, deprecated options, other
**Server-Side Errors**: Async work, deprecated HTML property, lifecycle unavailable
**Shared Errors**: Invalid snippets, lifecycle outside component, missing context, store shape
**Shared Warnings**: Void element content, uncloneable snapshots

### legacy_mode_api_reference
Complete reference for Svelte 3/4 legacy mode reactivity, component props, events, slots, and imperative API.

## Reactivity

Top-level variables are automatically reactive. Reassignment triggers updates; mutations like `.push()` require explicit reassignment:

```svelte
<script>
	let numbers = [1, 2, 3];
	function addNumber() {
		numbers.push(numbers.length + 1);
		numbers = numbers; // triggers update
	}
</script>
```

Reactive statements use `$:` prefix and re-run when dependencies change. Dependencies are determined at compile time by direct variable references (not function calls):

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(sum);
</script>
```

## Props and Exports

Props declared with `export` keyword; defaults apply when prop is `undefined`:

```svelte
<script>
	export let foo;
	export let bar = 'default';
	export function greet(name) { alert(`hello ${name}!`); }
</script>
```

Access all props with `$$props` and undeclared props with `$$restProps`:

```svelte
<button {...$$restProps} class="variant-{variant}"></button>
```

## Events

Attach handlers with `on:` directive; supports modifiers (`preventDefault`, `stopPropagation`, `capture`, `once`, `self`, `trusted`, etc.):

```svelte
<form on:submit|preventDefault={handleSubmit}></form>
<button on:click>forward event</button>
```

Dispatch custom events with `createEventDispatcher`:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('increment')}>increment</button>
```

## Slots

Default and named slots with fallback content:

```svelte
<!-- Modal.svelte -->
<slot></slot>
<slot name="buttons">Default button</slot>

<!-- App.svelte -->
<Modal>
	<div slot="buttons" let:item={data}>Custom content</div>
</Modal>
```

Check which slots were provided with `$$slots`:

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

Use `<svelte:fragment slot="name">` to place multiple elements in a named slot without a wrapper.

## Dynamic Components

`<svelte:component this={MyComponent} />` destroys and recreates when component reference changes.

`<svelte:self>` allows recursive self-reference (must be in conditional or slot to prevent infinite loops).

## Imperative API

Components are classes instantiated with target, props, and options:

```ts
import App from './App.svelte';
const app = new App({ target: document.body, props: { answer: 42 } });
app.$set({ answer: 43 });
const off = app.$on('event', callback);
app.$destroy();
```

With `accessors: true`, props become getters/setters with synchronous updates.

Server-side rendering exposes `render()` method returning `{ head, html, css }`.


