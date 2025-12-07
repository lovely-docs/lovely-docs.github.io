
## Directories

### introduction
Getting started with Svelte: project setup, file structure, and basic concepts

## Project Setup

**SvelteKit (Recommended):**
```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```
Official framework from Svelte team, powered by Vite, supports most application types.

**Vite Alternative:**
```sh
npm create vite@latest  # select svelte option
npm run build  # generates dist/
```
Uses vite-plugin-svelte; most projects need separate routing library. Other bundlers have plugins but Vite is recommended.

## Editor & Help

- VS Code extension (maintained by Svelte team)
- Command-line checking: `sv check`
- Community support via Discord and Stack Overflow (tag: svelte)

## .svelte File Structure

Components use `.svelte` files (superset of HTML) with optional sections:

```svelte
<script module>
	// runs once when module evaluates
	let total = 0;
</script>

<script>
	// runs per component instance
	total += 1;
</script>

<!-- markup -->

<style>
	/* scoped to component only */
	p { color: burlywood; }
</style>
```

- `<script>`: Instance-level logic; top-level variables accessible in markup; use runes for props/reactivity; supports TypeScript with `lang="ts"`
- `<script module>`: Module-level logic (rarely used); can export bindings but not `export default` (component is default export); variables accessible in component but not vice versa
- `<style>`: CSS scoped to component only
- All sections optional

## .svelte.js and .svelte.ts Files

Module files that support runes for reactive logic and state sharing across application. Cannot export reassigned state. Introduced in Svelte 5.

### runes
Svelte 5 compiler keywords for reactive state, derived values, side effects, component props, and debugging.

## Runes Overview

Runes are `$`-prefixed compiler keywords (not functions) that control Svelte language behavior. They cannot be imported, assigned to variables, or passed as arguments. Introduced in Svelte 5.

## $state

Creates reactive state. Plain values remain plain; arrays and objects become deeply reactive proxies that recursively proxify nested structures. Modifying nested properties triggers granular updates.

```svelte
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

Destructuring breaks reactivity since values are evaluated at destructuring time. Class instances are not proxied; use `$state` on class fields instead. The compiler transforms these into get/set methods on private fields.

**Variants:**
- `$state.raw`: Non-reactive state, only reassignable, not mutable. Improves performance for large objects you don't plan to mutate.
- `$state.snapshot`: Takes a static snapshot of a deeply reactive proxy, useful for passing to external libraries that don't expect proxies.
- `$state.eager`: Updates UI immediately when state changes, even in `await` expressions.

**Pass-by-value semantics:** JavaScript passes values, not references. To get reactive updates when passing state to functions, use functions/getters or proxies with get/set properties.

**Cross-module export:** State can only be exported if not directly reassigned. Either update properties instead of reassigning, or don't directly export state—use getter/setter functions instead.

## $derived

Creates reactive computed state that automatically updates when dependencies change. Expressions must be side-effect free.

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

**$derived.by:** For complex derivations, use a function body:
```js
let total = $derived.by(() => {
	let sum = 0;
	for (const n of numbers) sum += n;
	return sum;
});
```

Dependencies are determined by what is synchronously read inside the derived expression. Derived values can be temporarily reassigned (unless declared with `const`), useful for optimistic UI. Unlike `$state`, derived values are not converted to deeply reactive proxies.

**Destructuring:** Creates reactive properties for each destructured variable:
```js
let { a, b, c } = $derived(stuff());
// equivalent to: let a = $derived(_stuff.a); let b = $derived(_stuff.b); etc.
```

Svelte uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to its previous value, downstream updates are skipped.

## $effect

Runs side-effect functions when tracked state changes. Only runs in the browser, not during server-side rendering. Use for side effects like calling third-party libraries, drawing on canvas, or making network requests.

```svelte
let size = $state(50);
let color = $state('#ff3e00');
let canvas;

$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

Effects run after component mount and in a microtask after state changes. Re-runs are batched. Effects can return a teardown function that runs before re-run or when component is destroyed.

**Dependency tracking:** `$effect` tracks reactive values (`$state`, `$derived`, `$props`) that are synchronously read in the function body. Asynchronous reads (after `await` or inside `setTimeout`) are not tracked. Effects only re-run when the object itself changes, not when properties inside it change. Dependencies are determined by what was read in the last run, so conditional code affects this.

**Variants:**
- `$effect.pre`: Runs code before DOM updates.
- `$effect.tracking()`: Returns whether code is running inside a tracking context (effect or template).
- `$effect.pending()`: Returns count of pending promises in current boundary.
- `$effect.root()`: Creates a non-tracked scope without auto-cleanup. Useful for nested effects you want to manually control.

**Anti-patterns:** Don't update state inside effects—use `$derived` instead. Don't use effects to link values with circular dependencies—use `$derived` and function bindings instead.

## $props

Receives component inputs (properties) with destructuring, defaults, renaming, rest properties, reactivity, and type safety.

```svelte
<script>
  let { adjective = 'happy', super: trouper = 'lights', ...others } = $props();
</script>
```

Props update reactively when parent changes. Child can temporarily reassign but should not mutate unless the prop is bindable. Type annotations can be added for IDE support and documentation.

**$props.id()** (v5.20.0+): Generates a unique ID per component instance, consistent during hydration. Useful for linking elements:
```svelte
const uid = $props.id();
<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```

## $bindable

Marks a component prop as bindable, enabling two-way data flow between parent and child components. Allows the child to communicate changes back to the parent.

```svelte
// Child
let { value = $bindable(), ...props } = $props();
<input bind:value={value} {...props} />

// Parent
let message = $state('hello');
<FancyInput bind:value={message} />
```

Parent components don't have to use `bind:` — they can pass a normal prop if they don't want to listen to child changes.

## $inspect

Development-only rune that logs values whenever they change, similar to `console.log` but reactive. Tracks deep changes in objects and arrays.

```svelte
let count = $state(0);
$inspect(count); // logs when count changes
$inspect(count).with((type, count) => {
	if (type === 'update') debugger;
});
```

**$inspect.trace()** (v5.14+): Traces the surrounding function, printing which reactive state caused an effect or derived to re-run. Must be the first statement in a function body.

`$inspect` is a noop in production builds.

## $host

Provides access to the host element when compiling a component as a custom element. Allows dispatching custom events.

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('increment')}>increment</button>
```

### template_syntax
Complete template syntax reference: markup, events, conditionals, loops, async, snippets, bindings, actions, transitions, animations, styling, and special directives.

## Core Markup
- Lowercase tags (`<div>`) are HTML elements; capitalized/dot-notation tags (`<Widget>`, `<my.stuff>`) are components
- Attributes support unquoted values, JS expressions, or pure expressions: `<input type=checkbox />`, `<a href="page/{p}">`, `<button disabled={!clickable}>`
- Boolean attributes included if truthy, excluded if falsy; other attributes included unless null/undefined
- Shorthand: `{name}` instead of `name={name}` when names match
- Spread attributes: `<Widget a="b" {...things} c="d" />` (order matters, later overrides earlier)

## Events
- Listen with `on` prefix: `<button onclick={() => console.log('clicked')}>`
- Case-sensitive: `onclick` vs `onClick`
- Event attributes fire after bindings
- `ontouchstart` and `ontouchmove` are passive; use `on` from `svelte/events` to prevent defaults
- Delegated events (for performance): `beforeinput`, `click`, `change`, `dblclick`, `contextmenu`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `pointerdown`, `pointermove`, `pointerout`, `pointerover`, `pointerup`, `touchend`, `touchmove`, `touchstart`

## Text & HTML
- Text expressions in braces: `<h1>Hello {name}!</h1>`, `<p>{a} + {b} = {a + b}</p>`
- `null` and `undefined` omitted; others coerced to strings
- Use HTML entities for literal braces: `&lbrace;` or `&#123;` for `{`, `&rbrace;` or `&#125;` for `}`
- `{@html string}` injects raw HTML (sanitize to prevent XSS); injected HTML bypasses scoped styles, use `:global` to style it

## Comments
- HTML comments: `<!-- comment -->`
- `<!-- svelte-ignore a11y_autofocus -->` disables warnings for next block
- `<!-- @component ... -->` shows on hover in other files, supports markdown

## Conditional Rendering
- `{#if expr}...{:else if expr}...{:else}...{/if}` wraps elements or text

## Iteration
- `{#each items as item}...{/each}` iterates arrays/iterables
- With index: `{#each items as item, i}...{/each}`
- Keyed: `{#each items as item (item.id)}...{/each}` for intelligent reordering (insert/move/delete)
- Destructuring: `{#each items as { id, name, qty }, i (id)}...{/each}` or `{#each items as [id, ...rest]}...{/each}`
- Without binding: `{#each { length: 8 }, rank}...{/each}` renders n times
- Else clause: `{#each todos as todo}...{:else}<p>No tasks</p>{/each}`

## Key Blocks
- `{#key expr}...{/key}` destroys and recreates contents when expression changes
- Causes components to reinstantiate and reinitialize
- Useful for triggering transitions: `{#key value}<div transition:fade>{value}</div>{/key}`

## Async/Await
- `{#await promise}pending{:then value}resolved{:catch error}error{/await}`
- Omit blocks as needed: `{#await promise then value}...{/await}` or `{#await promise catch error}...{/await}`
- SSR renders only pending branch; non-Promise expressions render only then branch
- Lazy component loading: `{#await import('./Component.svelte') then { default: Component }}<Component />{/await}`

## Snippets
- Reusable markup blocks: `{#snippet name(param1, param2)}...{/snippet}`, rendered with `{@render name(args)}`
- Can reference enclosing scope and recursively call themselves
- Pass as props: `<Table {header} {row} />` or implicitly inside components
- Implicit `children` snippet: content inside component tags becomes `children` prop
- Optional snippets: `{@render children?.()}` or conditional `{#if children}{@render children()}{:else}fallback{/if}`
- Type with `Snippet<[Types]>`: `let { row }: { row: Snippet<[Item]> } = $props();`
- Export from `<script module>`: `export { snippetName };` (Svelte 5.5.0+)

## Directives

### bind: (Two-way binding)
- `bind:property={expr}` or shorthand `bind:property` (if name matches)
- Input bindings: `bind:value` (numeric inputs coerce to number), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox), `bind:files`
- Select: `bind:value` (any type), `<select multiple bind:value={array}>`
- Media (`<audio>`, `<video>`): two-way `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`, `videoWidth`, `videoHeight`
- Image: readonly `naturalWidth`, `naturalHeight`
- Details: `bind:open`
- Contenteditable: `bind:innerHTML`, `bind:innerText`, `bind:textContent`
- Dimensions (readonly, ResizeObserver): `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`
- `bind:this={ref}` gets DOM node reference (undefined until mounted)
- Component props: mark as bindable with `$bindable()` rune
- Function bindings (5.9.0+): `bind:value={() => value, (v) => value = v.toLowerCase()}` for validation/transformation; readonly: `bind:clientWidth={null, redraw}`

### use: (Actions)
- `use:actionName` or `use:actionName={params}` mounts action on element
- Actions are functions called on mount: `function myaction(node) { $effect(() => { /* setup */ return () => { /* teardown */ }; }); }`
- Runs once on mount, not reactive to argument changes
- Type with `Action<NodeType, ParamType, { onCustomEvent: (e: CustomEvent) => void }>`

### @attach (Attachments, 5.29+)
- `{@attach attachmentFn}` runs reactive function on element mount/state changes
- Can return cleanup function
- Factories: `function tooltip(content) { return (element) => { /* setup */ return cleanup; }; }`
- Inline: `{@attach (canvas) => { const ctx = canvas.getContext('2d'); $effect(() => { /* reactive */ }); }}`
- On components: creates Symbol-keyed prop, enables wrapper components
- Fully reactive: re-runs on changes to function, arguments, or state read inside

### transition: (Bidirectional transitions)
- `transition:transitionName` or `transition:transitionName={{ duration: 2000 }}`
- Local by default (play when block created/destroyed); `|global` modifier plays when parent blocks change
- Custom: `function whoosh(node, params) { return { delay, duration, easing, css: (t, u) => string, tick: (t, u) => void }; }`
- `t` is 0-1 after easing (0 for out, 1 for in); `u` equals `1 - t`
- Prefer `css` over `tick` for performance
- Events: `introstart`, `introend`, `outrostart`, `outroend`

### in: and out: (Unidirectional transitions)
- `in:transitionName` and `out:transitionName` play independently, don't reverse each other
- If block removed during `in` transition, both continue playing
- If `out` aborted, all transitions restart

### animate: (Reordering animations)
- `animate:animationName` on immediate children of keyed each blocks
- Triggered when data item index changes (not on add/remove)
- Custom: `function whizz(node, { from, to }, params) { return { delay, duration, easing, css: (t, u) => string, tick: (t, u) => void }; }`
- `from` and `to` are DOMRect objects
- Prefer `css` over `tick`

### style: (CSS styling)
- `style:property="value"` or `style:property={value}` or shorthand `style:property`
- Multiple: `style:color style:width="12rem" style:background-color={expr}`
- `|important` modifier: `style:color|important="red"`
- Directives take precedence over style attributes, even `!important`

### class: (Conditional classes)
- `class:className={condition}` or shorthand `class:className`
- Attribute form (preferred): `class={condition ? 'large' : 'small'}`, `class={{ cool, lame: !cool }}`, `class={[faded && 'opacity-50', large && 'scale-200']}`
- Arrays flatten nested arrays/objects, useful for combining local + prop classes
- Type safety (5.19+): `import type { ClassValue } from 'svelte/elements';`

## Special Tags

### {@const}
- `{@const area = box.width * box.height}` declares block-scoped constant
- Only allowed as immediate child of block, component, or `<svelte:boundary>`

### {@debug}
- `{@debug user}` or `{@debug user1, user2, user3}` logs on changes, pauses if devtools open
- Accepts comma-separated variable names only (not expressions)
- `{@debug}` without args inserts debugger statement on any state change

### {@render}
- `{@render snippetName(args)}` renders snippet
- Expression can be identifier or any JS expression: `{@render (cool ? coolSnippet : lameSnippet)()}`
- Optional: `{@render children?.()}`

## Async/Await Expressions (5.36+, experimental)
- `await` in top-level `<script>`, `$derived(...)`, or markup (requires `experimental.async: true`)
- Synchronized updates: UI waits for async work before updating
- Multiple independent `await` in markup run in parallel
- `<svelte:boundary pending={<p>Loading...</p>}>{await content()}</svelte:boundary>` shows placeholder on first creation
- `$effect.pending()` detects subsequent async work; `settled()` waits for completion
- Errors bubble to nearest error boundary
- SSR: `import { render } from 'svelte/server'; const { head, body } = await render(App);`
- `fork(...)` API preloads async work: `pending ??= fork(() => { open = true; }); pending?.commit();`

### styling
Component styling with automatic scoping, global style escape hatches, CSS custom properties, and nested style behavior.

## Scoped Styles

Svelte components automatically scope CSS via hash-based classes (e.g., `svelte-123xyz`). Scoped selectors gain +0-1-0 specificity, ensuring component styles override global stylesheets even if loaded later. When multiple scoping classes are needed, subsequent ones use `:where(.svelte-xyz123)` to avoid further specificity increases.

```svelte
<style>
	p { color: burlywood; } /* only affects <p> in this component */
</style>
```

`@keyframes` are scoped identically and animation rules are auto-adjusted to reference the scoped keyframe names.

## Global Styles

Use `:global(...)` modifier to apply styles globally:

```svelte
<style>
	:global(body) { margin: 0; }
	div :global(strong) { color: goldenrod; }
	p:global(.big.red) { /* applies to <p class="big red"> */ }
</style>
```

For globally accessible `@keyframes`, prepend `-global-` prefix (removed during compilation):

```svelte
<style>
	@keyframes -global-my-animation { /* ... */ }
</style>
```

Apply styles to multiple selectors globally using `:global {...}` block or `.a :global .b .c .d` syntax (everything after `:global` is unscoped).

## CSS Custom Properties

Pass CSS custom properties to components using `--property-name` syntax (static or dynamic):

```svelte
<Slider --track-color="black" --thumb-color="rgb({r} {g} {b})" />
```

Desugars to a wrapper element: `<svelte-css-wrapper style="display: contents; --track-color: black; ...">` for regular components, or `<g>` for SVG elements.

Read custom properties inside components using `var()` with optional fallbacks:

```svelte
<style>
	.track { background: var(--track-color, #aaa); }
</style>
```

Custom properties inherit from parent elements and can be defined globally on `:root`. The wrapper element doesn't affect layout but affects CSS `>` combinator selectors.

## Nested Style Elements

Nested `<style>` tags (inside elements or logic blocks) bypass Svelte's scoping and apply globally to the DOM without processing. Only one top-level `<style>` tag is allowed per component.

### special_elements
Special DOM and rendering control elements: error boundaries, window/document/body access, head injection, dynamic elements, and compiler options.

## Special Elements Reference

Svelte provides special elements prefixed with `svelte:` for accessing browser APIs and controlling rendering behavior.

### Error Boundary (`<svelte:boundary>`)
Creates error boundaries to catch rendering/effect errors. Shows pending UI while `await` expressions resolve, and failed UI when errors occur. Receives `pending` and `failed` snippets, plus optional `onerror` handler. **Limitation**: Only catches rendering/effect errors, not event handler or external async errors.

```svelte
<svelte:boundary onerror={(error, reset) => {}}>
  <p>{await delayed('hello!')}</p>
  {#snippet pending()}
    <p>loading...</p>
  {/snippet}
  {#snippet failed(error, reset)}
    <button onclick={reset}>retry</button>
  {/snippet}
</svelte:boundary>
```

### Window/Document/Body (`<svelte:window>`, `<svelte:document>`, `<svelte:body>`)
Attach event listeners and bind to properties with automatic cleanup. Must be top-level only.

**svelte:window** - Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX` (writable), `scrollY` (writable), `online`, `devicePixelRatio`. Attach events: `onkeydown`, `onresize`, etc.

**svelte:document** - Bindable properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`. Attach events like `onvisibilitychange`.

**svelte:body** - Attach events like `onmouseenter`, `onmouseleave` that don't fire on window.

```svelte
<svelte:window bind:scrollY={y} onkeydown={handleKeydown} />
<svelte:document bind:visibilityState={state} onvisibilitychange={handler} />
<svelte:body onmouseenter={enter} onmouseleave={leave} />
```

### Head (`<svelte:head>`)
Inserts elements into `document.head`. Top-level only. Useful for title, meta tags, and SEO.

```svelte
<svelte:head>
  <title>Page Title</title>
  <meta name="description" content="..." />
</svelte:head>
```

### Dynamic Element (`<svelte:element>`)
Renders DOM element with tag name from `this` prop. Only `bind:this` binding supported. Throws error if void element (br, hr) has children. Use `xmlns` for explicit namespace (e.g., SVG).

```svelte
<svelte:element this={tagName} xmlns="http://www.w3.org/2000/svg" />
```

### Options (`<svelte:options>`)
Per-component compiler options: `runes={true|false}`, `namespace="html|svg|mathml"`, `customElement="tag-name"`, `css="injected"`. Deprecated: `immutable`, `accessors`.

```svelte
<svelte:options customElement="my-element" namespace="svg" />
```

### runtime_apis
Runtime APIs for state management (stores, context), component lifecycle, and imperative component instantiation/rendering.

## Stores

Reactive state containers via `svelte/store` module. A store is an object with a `.subscribe(fn)` method that immediately calls the subscription function with the current value and whenever it changes, returning an unsubscribe function.

**writable**: Creates a store with `.set(value)` and `.update(callback)` methods. Optional second argument is a start function called when subscriber count goes 0→1, receiving `set`/`update` and returning a stop function:
```js
import { writable } from 'svelte/store';
const count = writable(0, () => {
  console.log('got a subscriber');
  return () => console.log('no more subscribers');
});
count.subscribe(v => console.log(v)); // logs 'got a subscriber', then '0'
count.set(1); // logs '1'
count.update(n => n + 1); // logs '2'
```

**readable**: Store whose value cannot be set externally. First argument is initial value; second argument works like writable's start function:
```js
const time = readable(new Date(), (set) => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});
```

**derived**: Derives a store from one or more other stores. Callback runs when first subscriber subscribes and whenever dependencies change. Can set values asynchronously via `set` and `update` arguments:
```js
const doubled = derived(a, ($a) => $a * 2);
const delayed = derived(a, ($a, set) => {
  setTimeout(() => set($a), 1000);
}, 2000); // initial value
const summed = derived([a, b], ([$a, $b]) => $a + $b);
```

**readonly**: Wraps a store to prevent external `.set()` calls while maintaining subscriptions.

**get**: Retrieves a store's value without subscribing (creates temporary subscription).

In components, use `$` prefix for auto-subscription: `$count` accesses value, `$count = 2` calls `.set()` on writable stores. Store must be declared at component top level. Svelte 5 runes largely supersede stores for basic state but stores remain useful for complex async streams and manual control.

## Context API

Pass values down component tree without prop-drilling. `setContext(key, value)` in parent, `getContext(key)` in child. Key and value can be any JavaScript value. Also available: `hasContext(key)`, `getAllContexts()`.

Store reactive state objects in context and mutate directly; reassigning breaks the link:
```svelte
<script>
  import { setContext } from 'svelte';
  let counter = $state({ count: 0 });
  setContext('counter', counter);
</script>
<button onclick={() => counter.count += 1}>increment</button>
```

Type-safe variant via `createContext<T>()` returns `[getContext, setContext]` tuple with proper typing.

Context is preferable to module-level `$state` for SSR since context is request-isolated while module state persists across users.

## Lifecycle Hooks

**onMount**: Runs after component mounts to DOM. Must be called during initialization. Does not run in server-rendered components. If it returns a function, that function runs on unmount (cleanup):
```js
import { onMount } from 'svelte';
onMount(() => {
  const interval = setInterval(() => console.log('beep'), 1000);
  return () => clearInterval(interval);
});
```

**onDestroy**: Runs immediately before unmount. Only lifecycle hook that runs in server-side components.

**tick**: Returns a promise that resolves after pending state changes apply to the DOM, or in the next microtask if none pending. Use for "after update" behavior.

**Deprecated**: `beforeUpdate`/`afterUpdate` (Svelte 4) fire before/after every component update. Replace with `$effect.pre` (before) and `$effect` (after) which only react to explicitly referenced state changes, avoiding unnecessary runs.

## Imperative Component API

**mount**: Instantiates and mounts a component to a DOM element:
```js
import { mount } from 'svelte';
const app = mount(App, {
  target: document.querySelector('#app'),
  props: { some: 'property' }
});
```
Effects and `onMount` do not run during mount — use `flushSync()` to force them.

**unmount**: Removes a component created with `mount` or `hydrate`. Returns a Promise that resolves after transitions complete (if `options.outro` is true) or immediately otherwise.

**render**: Server-only function that renders a component to HTML strings:
```js
import { render } from 'svelte/server';
const result = render(App, { props: { some: 'property' } });
result.body; // HTML for <body>
result.head; // HTML for <head>
```

**hydrate**: Like `mount`, but reuses HTML from server-side rendering and makes it interactive. Effects do not run during hydrate — use `flushSync()` afterwards if needed.

### advanced_topics
Testing frameworks, TypeScript support, custom elements/web components, Svelte 4→5 migration guides, and FAQ on tooling, routing, mobile development.

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

### api_reference
Complete API documentation for Svelte 5: component lifecycle, context, mounting, state management, animations, transitions, stores, compiler, and utilities.

## Core Component API

**Component type** - Type for strongly-typed Svelte components with intellisense support.

**mount(component, options)** - Mounts component to target, returns exports. Options: `target`, `anchor`, `props`, `events`, `context`, `intro`.

**hydrate(component, options)** - Hydrates SSR-rendered HTML on target.

**unmount(component, options)** - Unmounts component, optionally plays outro transitions with `{ outro: true }`.

## Lifecycle Functions

**onMount(callback)** - Runs after component mounts to DOM, can return cleanup function. Doesn't run during SSR.

**onDestroy(callback)** - Runs before unmount. Only lifecycle that runs in SSR.

**beforeUpdate/afterUpdate** - Deprecated, use `$effect.pre` and `$effect` instead.

## Context API

**createContext()** - Type-safe context pair returning `[get, set]` functions (5.40.0+).

**getContext(key)** - Retrieves context from parent.

**setContext(key, value)** - Associates context for children.

**getAllContexts()** - Gets entire context map.

**hasContext(key)** - Checks if context exists.

## Event Handling

**createEventDispatcher()** - Creates typed event dispatcher (deprecated, use callback props or `$host()`).

**on(target, event, handler, options)** - Attaches event listener to window/document/element/MediaQueryList/EventTarget, returns unsubscribe function. Preserves correct handler execution order vs declarative handlers.

## State & Synchronization

**tick()** - Returns promise resolving after pending state changes applied to DOM.

**settled()** - Returns promise resolving after state changes and async work complete (5.36+).

**flushSync(callback?)** - Synchronously flushes pending updates.

**fork(fn)** - Creates off-screen fork for speculative state changes, returns object with `commit()` and `discard()` methods (5.42+).

**untrack(fn)** - Prevents state reads inside function from being treated as dependencies.

**getAbortSignal()** - Returns AbortSignal that aborts when derived/effect re-runs or destroys.

## Animations & Transitions

**flip(node, {from, to}, params)** - FLIP animation for position changes. Returns AnimationConfig with `delay`, `duration`, `easing`, `css`, `tick`.

**Transition functions** - blur, fade, fly, scale, slide, draw (SVG), crossfade (paired morphing). All accept `delay`, `duration`, `easing` plus function-specific params.

**Easing functions** - 32 functions: linear, quad/cubic/quart/quint/sine/expo/circ/back/bounce/elastic with In/Out/InOut variants.

## Motion Classes

**Spring** - Physics-based animation class. Properties: `target`, `current`, `stiffness`, `damping`, `precision`. Methods: `set(value, options)` with `instant` and `preserveMomentum` options.

**Tween** - Time-based animation class. Properties: `target`, `current`. Methods: `set(value, options)` with delay/duration/easing overrides.

**prefersReducedMotion** - Media query matching user's prefers-reduced-motion setting (5.7.0+).

## Stores

**readable(value?, start?)** - Read-only store with optional initialization callback.

**writable(value?, start?)** - Store with `set(value)` and `update(updater)` methods.

**derived(stores, fn, initial?)** - Computed store from source stores, supports async via `set`/`update` callbacks.

**get(store)** - Synchronously retrieves current store value.

**readonly(store)** - Wraps store to hide write interface.

**fromStore(store)** - Converts store to reactive object with `current` property.

**toStore(get, set?)** - Converts getter/setter functions to store.

## Reactive Built-ins

**MediaQuery** - Wraps `matchMedia()` with reactive `current` property (5.7.0+).

**SvelteDate** - Reactive Date wrapper, triggers reactivity on method reads.

**SvelteMap/SvelteSet** - Reactive Map/Set, trigger on iteration/size/get/has/add/delete.

**SvelteURL/SvelteURLSearchParams** - Reactive URL wrapper with reactive `searchParams`.

**createSubscriber(start)** - Integrates external event systems with Svelte reactivity (5.7.0+).

## Reactive Window Properties

**innerWidth/Height, outerWidth/Height, scrollX/Y, screenLeft/Top, devicePixelRatio, online** - All have reactive `.current` property, undefined on server. screenLeft/Top update via requestAnimationFrame.

## Attachments

**createAttachmentKey()** - Creates symbol for programmatic attachment spreading onto elements.

**fromAction(action, fn)** - Converts action to attachment with identical behavior.

**Attachment** - Function running on element mount, optionally returns cleanup function.

## Compiler API

**compile(source, options)** - Converts `.svelte` to JavaScript module. Returns `{ js, css, warnings, metadata, ast }`.

**compileModule(source, options)** - Compiles JavaScript with runes.

**parse(source, options)** - Parses component to AST. With `modern: true` returns modern format.

**preprocess(source, preprocessor, options)** - Applies preprocessor hooks (e.g., sass→css). Accepts single or array of PreprocessorGroup.

**migrate(source, options)** - Best-effort migration to runes/event attributes/render tags.

**CompileOptions** - `name`, `customElement`, `namespace`, `css` ('injected'|'external'), `cssHash`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `runes`, `compatibility.componentApi` (4|5), `experimental.async`.

## Server Rendering

**render(component, options)** - Server-only function returning `{ body, head }` HTML strings. Options: `props`, `context`, `idPrefix`.

## Types

**ComponentProps** - Extracts props type from component.

**Snippet** - Type for snippet blocks with typed parameters.

**Action/ActionReturn** - Interfaces for typing element lifecycle functions with optional update/destroy callbacks and custom attributes/events.

## Legacy APIs

**asClassComponent, createClassComponent, createBubbler** - Svelte 4 compatibility functions.

**Event modifiers** - once, preventDefault, stopPropagation, stopImmediatePropagation, self, trusted, passive, nonpassive functions replacing removed modifiers.

**spring(value?, opts?), tweened(value?, defaults?)** - Deprecated store functions, use Spring/Tween classes instead.

### legacy_mode_api
Svelte 3/4 legacy mode API: reactive variables via assignment, `$:` reactive statements, `export let` props, `on:` event handlers with modifiers, `createEventDispatcher` for custom events, slots with `let:` data passing, imperative component constructor with `$set/$on/$destroy` methods.

## Reactive Variables and Statements

In legacy mode, top-level variables are automatically reactive. Reassignment triggers updates, but mutations (like `.push()`) require explicit reassignment:

```svelte
<script>
	let count = 0;
	let numbers = [1, 2, 3];
	function addNumber() {
		numbers.push(numbers.length + 1);
		numbers = numbers; // triggers update
	}
</script>
<button on:click={() => count += 1}>clicks: {count}</button>
```

Reactive statements use `$:` prefix and auto-rerun when dependencies change. Dependencies are compile-time detected by analyzing variable references (not assignments). Statements are topologically ordered:

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(`${a} + ${b} = ${sum}`); // runs after sum is calculated
	$: if (browser) document.title = title; // wrap SSR-unsafe code
</script>
```

Indirect dependencies fail—the compiler can't see dependencies through function calls or closures.

## Props and Component API

Props declared with `export let`:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
	export function greet(name) { alert(`hello ${name}!`); }
	let className;
	export { className as class }; // rename props
</script>
```

Access all props with `$$props` (includes undeclared) and `$$restProps` (excludes declared exports):

```svelte
<button {...$$restProps} class="variant-{variant}">click me</button>
```

## Events

Attach handlers with `on:` directive and optional modifiers:

```svelte
<button on:click|once|preventDefault={handler}>click</button>
```

Available modifiers: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`. Forward events without a handler: `<button on:click>`.

Dispatch custom component events with `createEventDispatcher`:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('increment', { value: 1 })}>+</button>
```

Parent listens: `<Stepper on:increment={(e) => n += e.detail.value} />`. Component events don't bubble; only `once` modifier is valid.

**Migration note**: Use callback props instead for Svelte 5: `export let increment;` then `<button on:click={increment}>`.

## Slots

Default and named slots with fallback content:

```svelte
<!-- Modal.svelte -->
<div class="modal">
	<slot></slot>
	<slot name="buttons">Close</slot>
</div>

<!-- App.svelte -->
<Modal>
	Default content
	<div slot="buttons"><button>OK</button></div>
</Modal>
```

Pass data to slotted content via props and `let:` directive:

```svelte
<!-- FancyList.svelte -->
<ul>
	{#each items as data}
		<li><slot item={process(data)} /></li>
	{/each}
</ul>

<!-- App.svelte -->
<FancyList {items} let:item={processed}>
	<div>{processed.text}</div>
</FancyList>
```

Check which slots were provided with `$$slots`:

```svelte
{#if $$slots.description}
	<hr />
	<slot name="description" />
{/if}
```

Use `<svelte:fragment slot="name">` to fill named slots without wrapping in a DOM element.

## Dynamic Components and Recursion

Render dynamic components with `<svelte:component this={ref} />` to properly handle instance recreation when the component reference changes. If `this` is falsy, nothing renders.

Recursive components use `<svelte:self>` (deprecated—import the component directly instead):

```svelte
<script>
	export let count;
</script>
{#if count > 0}
	<p>counting down... {count}</p>
	<svelte:self count={count - 1} />
{:else}
	<p>lift-off!</p>
{/if}
```

## Imperative Component API (Svelte 3/4)

Create components with constructor:

```ts
import App from './App.svelte';
const app = new App({
	target: document.body,
	props: { answer: 42 },
	anchor: null,
	context: new Map(),
	hydrate: false,
	intro: false
});
```

Methods:
- `$set(props)`: update props (async, schedules for next microtask)
- `$on(event, callback)`: listen to events, returns unsubscribe function
- `$destroy()`: remove from DOM and trigger cleanup

With `accessors: true` compiler option, props have getters/setters for synchronous updates: `component.count += 1`.

Server-side rendering: `App.render(props, { context: new Map() })` returns `{ head, html, css }`.

**Svelte 5 migration**: Use `mount()` and `unmount()` instead, pass callback props instead of `createEventDispatcher`, use `$state` for reactive props.


