

## Pages

### basic-markup
HTML++ markup: lowercase/capitalized tags for elements/components, attributes with JS expressions and shorthand, event listeners with case-sensitive `on` prefix and delegation, text expressions in braces, `{@html}` for HTML, comments with `svelte-ignore` and `@component` directives.

## Tags
Lowercase tags like `<div>` are HTML elements. Capitalized tags or dot-notation tags like `<Widget>` or `<my.stuff>` are components.

```svelte
<script>
	import Widget from './Widget.svelte';
</script>
<div>
	<Widget />
</div>
```

## Element attributes
Attributes work like HTML. Values can be unquoted, contain JavaScript expressions, or be pure expressions:

```svelte
<div class="foo">
	<button disabled>can't touch this</button>
</div>
<input type=checkbox />
<a href="page/{p}">page {p}</a>
<button disabled={!clickable}>...</button>
```

Boolean attributes are included if truthy, excluded if falsy. All other attributes are included unless nullish (`null` or `undefined`):

```svelte
<input required={false} placeholder="This input field is not required" />
<div title={null}>This div has no title attribute</div>
```

When attribute name and value match, use shorthand: `{name}` instead of `name={name}`:

```svelte
<button {disabled}>...</button>
```

## Component props
Values passed to components are called _props_ (not attributes). Use same shorthand as attributes:

```svelte
<Widget foo={bar} answer={42} text="hello" />
```

## Spread attributes
Multiple attributes/props can be spread at once. Order matters — later values override earlier ones:

```svelte
<Widget a="b" {...things} c="d" />
```

## Events
Listen to DOM events with `on` prefix attributes. Event attributes are case-sensitive (`onclick` vs `onClick`):

```svelte
<button onclick={() => console.log('clicked')}>click me</button>
<button {onclick}>click me</button>
<button {...thisSpreadContainsEventAttributes}>click me</button>
```

Event attributes fire after bindings. `ontouchstart` and `ontouchmove` are passive for performance. For preventing defaults on these, use the `on` function from `svelte/events` instead.

### Event delegation
Svelte delegates certain events to the application root for performance. When manually dispatching delegated events, set `{ bubbles: true }`. Avoid `stopPropagation` with `addEventListener` as it prevents reaching the root. Use `on` from `svelte/events` instead of `addEventListener` to preserve order and handle `stopPropagation` correctly.

Delegated events: `beforeinput`, `click`, `change`, `dblclick`, `contextmenu`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `pointerdown`, `pointermove`, `pointerout`, `pointerover`, `pointerup`, `touchend`, `touchmove`, `touchstart`.

## Text expressions
JavaScript expressions in curly braces are rendered as text. `null` and `undefined` are omitted; others are coerced to strings:

```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>
<div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
```

Use HTML entities for literal braces: `&lbrace;` or `&#123;` for `{`, `&rbrace;` or `&#125;` for `}`.

Render HTML with `{@html}` tag (ensure string is escaped or controlled to prevent XSS):

```svelte
{@html potentiallyUnsafeHtmlString}
```

## Comments
HTML comments work normally:

```svelte
<!-- this is a comment! --><h1>Hello world</h1>
```

`svelte-ignore` comments disable warnings for the next block (usually accessibility):

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input bind:value={name} autofocus />
```

`@component` comments show on hover in other files and support markdown:

```svelte
<!--
@component
- You can use markdown here.
- Usage:
  ```html
  <Main name="Arethra">
  ```
-->
<script>
	let { name } = $props();
</script>
<main>
	<h1>Hello, {name}</h1>
</main>
```

### if-blocks
Conditional rendering: {#if expr}...{:else if expr}...{:else}...{/if} wraps elements or text

## Conditional Rendering with If Blocks

Wrap content in `{#if expression}...{/if}` blocks to conditionally render it based on expressions.

```svelte
{#if answer === 42}
	<p>what was the question?</p>
{/if}
```

Add additional conditions with `{:else if expression}`:

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

Blocks can wrap elements or text within elements. Use `{:else}` for a final fallback clause.

### each-blocks
Each blocks iterate over arrays/iterables with optional index, keying, destructuring, and else clause for empty lists.

## Each Blocks

Iterate over arrays, array-like objects, or iterables (Map, Set, etc.) using `{#each expression as name}...{/each}`.

**Basic iteration:**
```svelte
{#each items as item}
  <li>{item.name} x {item.qty}</li>
{/each}
```

**With index:**
```svelte
{#each items as item, i}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

**Keyed each blocks** — provide a unique key expression to intelligently update lists (insert, move, delete) rather than just appending/removing. Keys should be strings or numbers for identity persistence:
```svelte
{#each items as item (item.id)}
  <li>{item.name} x {item.qty}</li>
{/each}

{#each items as item, i (item.id)}
  <li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

**Destructuring and rest patterns:**
```svelte
{#each items as { id, name, qty }, i (id)}
  <li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
  <li><span>{id}</span><MyComponent {...rest} /></li>
{/each}

{#each items as [id, ...rest]}
  <li><span>{id}</span><MyComponent values={rest} /></li>
{/each}
```

**Without item binding** — render n times by omitting `as`:
```svelte
{#each { length: 8 }, rank}
  {#each { length: 8 }, file}
    <div class:black={(rank + file) % 2 === 1}></div>
  {/each}
{/each}
```

**Else clause** — rendered when list is empty:
```svelte
{#each todos as todo}
  <p>{todo.text}</p>
{:else}
  <p>No tasks today!</p>
{/each}
```

### key-block
Block that destroys/recreates contents and reinitializes components or replays transitions when expression value changes

{#key expression}...{/key} block destroys and recreates its contents when the expression value changes.

When wrapping components, causes them to be reinstantiated and reinitialised:
```svelte
{#key value}
	<Component />
{/key}
```

Useful for triggering transitions whenever a value changes:
```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```

### await-blocks
Await blocks branch on Promise states with optional pending/then/catch blocks; supports lazy component loading via dynamic imports.

## Await Blocks

Await blocks allow you to branch on the three possible states of a Promise: pending, fulfilled, or rejected.

### Syntax

```svelte
{#await expression}...{:then name}...{:catch name}...{/await}
{#await expression}...{:then name}...{/await}
{#await expression then name}...{/await}
{#await expression catch name}...{/await}
```

### Full Example with All States

```svelte
{#await promise}
	<p>waiting for the promise to resolve...</p>
{:then value}
	<p>The value is {value}</p>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
```

### Omitting Blocks

The `catch` block can be omitted if you don't need to handle rejections:

```svelte
{#await promise}
	<p>waiting...</p>
{:then value}
	<p>The value is {value}</p>
{/await}
```

Omit the initial pending block if you don't care about that state:

```svelte
{#await promise then value}
	<p>The value is {value}</p>
{/await}
```

Omit the `then` block to show only the error state:

```svelte
{#await promise catch error}
	<p>The error is {error}</p>
{/await}
```

### Server-Side Rendering

During server-side rendering, only the pending branch will be rendered. If the expression is not a Promise, only the `then` branch will be rendered.

### Lazy Component Loading

Use with dynamic imports to render components lazily:

```svelte
{#await import('./Component.svelte') then { default: Component }}
	<Component />
{/await}
```

### snippet
Snippets: reusable markup blocks with parameters, passed as props, support recursion, lexical scoping, optional rendering, TypeScript typing via Snippet<[Types]>, implicit children snippet, module exports.

# Snippets in Svelte

Snippets are reusable chunks of markup declared with `{#snippet name()}...{/snippet}` syntax. They reduce code duplication by extracting repeated template patterns.

## Basic Usage

Snippets can have parameters with default values and destructuring:

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>{@render figure(image)}</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

Rendered with `{@render snippetName(args)}`.

## Scope

Snippets can reference values from their enclosing scope (script, each blocks, etc.) and are visible to siblings and their children in the same lexical scope:

```svelte
<script>
	let { message = `it's great!` } = $props();
</script>

{#snippet hello(name)}
	<p>hello {name}! {message}!</p>
{/snippet}

{@render hello('alice')}
```

Snippets can reference themselves and each other for recursion:

```svelte
{#snippet countdown(n)}
	{#if n > 0}
		<span>{n}...</span>
		{@render countdown(n - 1)}
	{:else}
		{@render blastoff()}
	{/if}
{/snippet}

{#snippet blastoff()}
	<span>🚀</span>
{/snippet}

{@render countdown(10)}
```

## Passing Snippets to Components

### Explicit Props
Snippets are values and can be passed as component props:

```svelte
{#snippet header()}
	<th>fruit</th>
	<th>qty</th>
{/snippet}

{#snippet row(d)}
	<td>{d.name}</td>
	<td>{d.qty}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

### Implicit Props
Snippets declared directly inside a component implicitly become props:

```svelte
<Table data={fruits}>
	{#snippet header()}
		<th>fruit</th>
		<th>qty</th>
	{/snippet}

	{#snippet row(d)}
		<td>{d.name}</td>
		<td>{d.qty}</td>
	{/snippet}
</Table>
```

### Implicit `children` Snippet
Content inside component tags that isn't a snippet declaration becomes the `children` snippet:

```svelte
<!-- App.svelte -->
<Button>click me</Button>

<!-- Button.svelte -->
<script>
	let { children } = $props();
</script>
<button>{@render children()}</button>
```

### Optional Snippet Props
Use optional chaining or conditional rendering for optional snippets:

```svelte
{@render children?.()}

{#if children}
	{@render children()}
{:else}
	fallback content
{/if}
```

## Typing Snippets

Import `Snippet` from `'svelte'` and use it in type definitions. The type argument is a tuple of parameter types:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		data: any[];
		children: Snippet;
		row: Snippet<[any]>;
	}

	let { data, children, row }: Props = $props();
</script>
```

Use generics to tie data and snippet types together:

```svelte
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	let {
		data,
		children,
		row
	}: {
		data: T[];
		children: Snippet;
		row: Snippet<[T]>;
	} = $props();
</script>
```

## Exporting Snippets

Snippets at the top level can be exported from `<script module>` if they don't reference non-module script declarations (requires Svelte 5.5.0+):

```svelte
<script module>
	export { add };
</script>

{#snippet add(a, b)}
	{a} + {b} = {a + b}
{/snippet}
```

## Programmatic Snippets

Use `createRawSnippet` API for advanced programmatic snippet creation.

## Snippets vs Slots

Snippets replace the deprecated Svelte 4 slots feature with more power and flexibility.

### @render
@render tag invokes snippets with optional chaining and conditional fallback support.

The `{@render ...}` tag renders a snippet. Snippets are reusable template blocks that can be passed as props or defined locally.

**Basic usage:**
```svelte
{#snippet sum(a, b)}
	<p>{a} + {b} = {a + b}</p>
{/snippet}

{@render sum(1, 2)}
{@render sum(3, 4)}
{@render sum(5, 6)}
```

The expression can be a simple identifier or any JavaScript expression:
```svelte
{@render (cool ? coolSnippet : lameSnippet)()}
```

**Optional snippets:**
When a snippet might be undefined (e.g., from a prop), use optional chaining to render only when defined:
```svelte
{@render children?.()}
```

Or use conditional rendering with fallback content:
```svelte
{#if children}
	{@render children()}
{:else}
	<p>fallback content</p>
{/if}
```

### @html_tag
Inject raw HTML with `{@html ...}`; sanitize input to prevent XSS; injected HTML bypasses scoped styles, use `:global` to style it.

The `{@html ...}` tag injects raw HTML into a component.

**Basic usage:**
```svelte
<article>
	{@html content}
</article>
```

**Security:** Always escape the passed string or only use values under your control to prevent XSS attacks. Never render unsanitized content.

**Valid HTML requirement:** The expression must be valid standalone HTML. This fails because `</div>` alone is invalid:
```svelte
{@html '<div>'}content{@html '</div>'}
```

It also will not compile Svelte code.

**Styling limitation:** Content rendered with `{@html ...}` is invisible to Svelte and won't receive scoped styles. Scoped style rules targeting elements inside injected HTML won't work:
```svelte
<article>
	{@html content}
</article>

<style>
	article {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```

Use the `:global` modifier to style injected content:
```svelte
<style>
	article :global {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```

### @attach_directive
Attachments are reactive functions that run in effects on element mount/state changes with optional cleanup; support factories, inline definitions, component props via Symbols, and conversion from actions.

## Overview
Attachments are functions that run in an effect when an element is mounted to the DOM or when state read inside the function updates. They can optionally return a cleanup function called before re-run or after element removal. Available in Svelte 5.29+.

## Basic Usage
```svelte
<script>
	function myAttachment(element) {
		console.log(element.nodeName);
		return () => {
			console.log('cleaning up');
		};
	}
</script>

<div {@attach myAttachment}>...</div>
```

Elements can have multiple attachments.

## Attachment Factories
Functions can return attachments, useful for parameterized behavior:
```svelte
<script>
	import tippy from 'tippy.js';
	let content = $state('Hello!');

	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>

<input bind:value={content} />
<button {@attach tooltip(content)}>Hover me</button>
```

The attachment re-runs whenever `content` changes or any state read inside the attachment function changes.

## Inline Attachments
Attachments can be defined inline:
```svelte
<canvas
	width={32}
	height={32}
	{@attach (canvas) => {
		const context = canvas.getContext('2d');
		$effect(() => {
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
		});
	}}
></canvas>
```

The nested effect runs when `color` changes; the outer effect runs once since it doesn't read reactive state.

## Passing Attachments to Components
When used on a component, `{@attach ...}` creates a prop with a Symbol key. If the component spreads props onto an element, the element receives those attachments. This enables wrapper components:

```svelte
<!-- Button.svelte -->
<script>
	let { children, ...props } = $props();
</script>
<button {...props}>{@render children?.()}</button>

<!-- App.svelte -->
<script>
	import Button from './Button.svelte';
	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>
<Button {@attach tooltip(content)}>Hover me</Button>
```

## Controlling Re-runs
Attachments are fully reactive: `{@attach foo(bar)}` re-runs on changes to `foo`, `bar`, or any state read inside `foo`. To avoid expensive setup work re-running, pass data via a function and read it in a child effect:

```js
function foo(getBar) {
	return (node) => {
		veryExpensiveSetupWork(node);
		$effect(() => {
			update(node, getBar());
		});
	}
}
```

## Programmatic Creation
Use `createAttachmentKey` to add attachments to objects that will be spread onto components or elements.

## Converting Actions
Use `fromAction` to convert library actions to attachments, enabling use with components.

### @const
Declare block-scoped constants with `{@const}` inside blocks, components, or boundaries.

The `{@const ...}` tag defines a local constant within a block scope.

**Usage:**
```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

**Constraints:**
- Only allowed as an immediate child of a block (`{#if ...}`, `{#each ...}`, `{#snippet ...}`, etc.), a `<Component />`, or a `<svelte:boundary>`
- Creates a variable that is scoped to the containing block

### @debug
Debug tag for logging variable changes and pausing execution; accepts comma-separated variable names only, not expressions.

The `{@debug ...}` tag logs variable values whenever they change and pauses execution when devtools are open, serving as an alternative to `console.log()`.

**Usage:**
```svelte
<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

{@debug user}
{@debug user1, user2, user3}
```

**Syntax rules:**
- Accepts comma-separated variable names only (not expressions)
- Valid: `{@debug user}`, `{@debug user1, user2, user3}`
- Invalid: `{@debug user.firstname}`, `{@debug myArray[0]}`, `{@debug !isReady}`, `{@debug typeof user === 'object'}`

**Parameterless form:**
`{@debug}` without arguments inserts a `debugger` statement triggered on any state change, rather than specific variables.

### bind
Two-way data binding directive enabling child-to-parent flow; supports inputs (value/checked/group/files), selects, media elements (audio/video), images, details, contenteditable, dimensions, DOM/component references, and component props via $bindable() rune with optional getter/setter functions.

## Two-way data binding directive

The `bind:` directive enables data to flow from child to parent (opposite of normal downward flow). Syntax: `bind:property={expression}` where expression is an lvalue. Can omit expression if it matches property name: `bind:value` equals `bind:value={value}`.

Svelte creates event listeners that update bound values. Most bindings are two-way (changes affect both element and value); some are readonly (value changes don't affect element).

### Function bindings
Use `bind:property={get, set}` with getter/setter functions for validation/transformation:
```svelte
<input bind:value={() => value, (v) => value = v.toLowerCase()} />
```
For readonly bindings, set get to `null`:
```svelte
<div bind:clientWidth={null, redraw} bind:clientHeight={null, redraw}>...</div>
```
Available in Svelte 5.9.0+.

### Input bindings

**`bind:value`** - binds input's value property. Numeric inputs (type="number" or type="range") coerce to number:
```svelte
<script>
	let a = $state(1);
	let b = $state(2);
</script>
<input type="number" bind:value={a} min="0" max="10" />
<input type="range" bind:value={a} min="0" max="10" />
<p>{a} + {b} = {a + b}</p>
```
Empty/invalid numeric inputs become `undefined`. Since 5.6.0, inputs with `defaultValue` in forms revert to that on reset (binding takes precedence unless null/undefined).

**`bind:checked`** - checkbox binding:
```svelte
<input type="checkbox" bind:checked={accepted} />
```
Since 5.6.0, `defaultChecked` attribute reverts on form reset.

**`bind:indeterminate`** - independent of checked state:
```svelte
<input type="checkbox" bind:checked bind:indeterminate>
{#if indeterminate}
	waiting...
{:else if checked}
	checked
{:else}
	unchecked
{/if}
```

**`bind:group`** - groups radio/checkbox inputs:
```svelte
<script>
	let tortilla = $state('Plain');
	let fillings = $state([]);
</script>
<!-- radio inputs are mutually exclusive -->
<label><input type="radio" bind:group={tortilla} value="Plain" /> Plain</label>
<label><input type="radio" bind:group={tortilla} value="Whole wheat" /> Whole wheat</label>
<!-- checkbox inputs populate array -->
<label><input type="checkbox" bind:group={fillings} value="Rice" /> Rice</label>
<label><input type="checkbox" bind:group={fillings} value="Beans" /> Beans</label>
```
Only works if inputs are in same component.

**`bind:files`** - file input binding returns FileList. Update programmatically using DataTransfer:
```svelte
<script>
	let files = $state();
	function clear() {
		files = new DataTransfer().files;
	}
</script>
<input accept="image/png, image/jpeg" bind:files type="file" />
<button onclick={clear}>clear</button>
```
FileList objects are immutable; create new DataTransfer to modify.

### Select bindings

**`bind:value`** - binds to selected option's value (can be any type, not just strings):
```svelte
<select bind:value={selected}>
	<option value={a}>a</option>
	<option value={b}>b</option>
</select>
```

**`<select multiple>`** - bound variable is array of selected option values:
```svelte
<select multiple bind:value={fillings}>
	<option>Rice</option>
	<option>Beans</option>
	<option>Cheese</option>
</select>
```
When option value matches text content, value attribute can be omitted. Use `selected` attribute for default selection; binding takes precedence if not `undefined`. Reverts to selected option on form reset.

### Media element bindings

**`<audio>` and `<video>`** two-way bindings:
- `currentTime`, `playbackRate`, `paused`, `volume`, `muted`

Readonly bindings:
- `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

Video-only readonly: `videoWidth`, `videoHeight`

```svelte
<audio src={clip} bind:duration bind:currentTime bind:paused></audio>
```

### Image bindings

**`<img>`** readonly bindings:
- `naturalWidth`, `naturalHeight`

### Details binding

**`<details bind:open>`** - binds to open property:
```svelte
<details bind:open={isOpen}>
	<summary>How do you comfort a JavaScript bug?</summary>
	<p>You console it.</p>
</details>
```

### Contenteditable bindings

Elements with `contenteditable` support:
- `innerHTML`, `innerText`, `textContent`

```svelte
<div contenteditable="true" bind:innerHTML={html}></div>
```

### Dimension bindings

All visible elements have readonly bindings (measured with ResizeObserver):
- `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`
- `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`

```svelte
<div bind:offsetWidth={width} bind:offsetHeight={height}>
	<Chart {width} {height} />
</div>
```
`display: inline` elements have no dimensions and can't be observed; change to `inline-block`. CSS transforms don't trigger ResizeObserver.

### bind:this

Get reference to DOM node (undefined until mounted, read in effects/handlers, not during init):
```svelte
<script>
	let canvas;
	$effect(() => {
		const ctx = canvas.getContext('2d');
		drawStuff(ctx);
	});
</script>
<canvas bind:this={canvas}></canvas>
```

Works with components too:
```svelte
<!-- App.svelte -->
<ShoppingCart bind:this={cart} />
<button onclick={() => cart.empty()}>Empty shopping cart</button>

<!-- ShoppingCart.svelte -->
<script>
	export function empty() { }
</script>
```

### Component property binding

Bind to component props with same syntax as elements:
```svelte
<Keypad bind:value={pin} />
```
Mark properties as bindable using `$bindable()` rune:
```svelte
<script>
	let { readonlyProperty, bindableProperty = $bindable() } = $props();
</script>
```
Bindable properties can have fallback values (only apply when not bound):
```svelte
<script>
	let { bindableProperty = $bindable('fallback value') } = $props();
</script>
```
When bound with fallback, parent must provide non-undefined value or runtime error thrown.

### use_directive
use: directive mounts actions on elements with $effect-based lifecycle; accepts typed parameters and custom event handlers; runs once, not reactive to argument changes.

## Actions with `use:` directive

Actions are functions called when an element is mounted, added via the `use:` directive. They typically use `$effect` to manage setup and teardown:

```svelte
<script>
	function myaction(node) {
		$effect(() => {
			// setup
			return () => {
				// teardown
			};
		});
	}
</script>

<div use:myaction>...</div>
```

Actions can accept arguments:

```svelte
function myaction(node, data) { /* ... */ }
<div use:myaction={data}>...</div>
```

The action runs once on mount (not during SSR) and does not re-run if the argument changes.

## Typing

The `Action` interface accepts three optional type parameters: node type (e.g., `HTMLDivElement` or `Element`), parameter type, and custom event handlers:

```svelte
/**
 * @type {import('svelte/action').Action<
 * 	HTMLDivElement,
 * 	undefined,
 * 	{
 * 		onswiperight: (e: CustomEvent) => void;
 * 		onswipeleft: (e: CustomEvent) => void;
 * 	}
 * >}
 */
function gestures(node) {
	$effect(() => {
		node.dispatchEvent(new CustomEvent('swipeleft'));
		node.dispatchEvent(new CustomEvent('swiperight'));
	});
}
```

Use in template:
```svelte
<div use:gestures onswipeleft={next} onswiperight={prev}>...</div>
```

**Legacy note:** Prior to `$effect`, actions could return objects with `update` and `destroy` methods. Using effects is preferred. In Svelte 5.29+, consider using attachments instead for more flexibility.

### transition
Bidirectional DOM transitions via transition: directive; supports local/global scope, parameters, custom functions with css/tick callbacks, and lifecycle events.

## Transitions

A transition is triggered when an element enters or leaves the DOM due to a state change. All elements in a transitioning block are kept in the DOM until all transitions complete.

The `transition:` directive creates a bidirectional transition that can be smoothly reversed mid-animation:

```svelte
<script>
	import { fade } from 'svelte/transition';
	let visible = $state(false);
</script>

<button onclick={() => visible = !visible}>toggle</button>

{#if visible}
	<div transition:fade>fades in and out</div>
{/if}
```

### Local vs Global

Transitions are local by default (only play when their block is created/destroyed). Use the `|global` modifier to make them play when parent blocks change:

```svelte
{#if x}
	{#if y}
		<p transition:fade>only when y changes</p>
		<p transition:fade|global>when x or y change</p>
	{/if}
{/if}
```

### Transition Parameters

Transitions accept parameters as an object:

```svelte
<div transition:fade={{ duration: 2000 }}>fades over two seconds</div>
```

### Custom Transition Functions

Custom transitions are functions with signature:
```js
transition = (node: HTMLElement, params: any, options: { direction: 'in' | 'out' | 'both' }) => {
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
}
```

If the returned object has a `css` function, Svelte generates keyframes for web animations. The `t` argument is 0-1 after easing (0 for out transitions, 1 for in transitions, representing the element's natural state). The `u` argument equals `1 - t`. The function is called repeatedly before the transition begins.

Example with CSS-based animation:

```svelte
<script>
	import { elasticOut } from 'svelte/easing';
	export let visible;

	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');
		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			easing: params.easing || elasticOut,
			css: (t, u) => `transform: ${existingTransform} scale(${t})`
		};
	}
</script>

{#if visible}
	<div in:whoosh>whooshes in</div>
{/if}
```

Alternatively, return a `tick` function called during the transition (prefer `css` for performance):

```svelte
<script>
	export let visible = false;

	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;
		if (!valid) throw new Error(`Single text node child required`);

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

{#if visible}
	<p in:typewriter={{ speed: 1 }}>The quick brown fox jumps over the lazy dog</p>
{/if}
```

If a transition function returns a function instead of an object, it's called in the next microtask, allowing multiple transitions to coordinate for crossfade effects.

The `options` argument contains `direction` ('in', 'out', or 'both').

### Transition Events

Elements with transitions dispatch: `introstart`, `introend`, `outrostart`, `outroend`

```svelte
{#if visible}
	<p
		transition:fly={{ y: 200, duration: 2000 }}
		onintrostart={() => (status = 'intro started')}
		onoutrostart={() => (status = 'outro started')}
		onintroend={() => (status = 'intro ended')}
		onoutroend={() => (status = 'outro ended')}
	>
		Flies in and out
	</p>
{/if}
```

### in-and-out-directives
in: and out: directives apply unidirectional transitions that play independently rather than reversing each other

## in: and out: Directives

The `in:` and `out:` directives are similar to `transition:` but create unidirectional transitions instead of bidirectional ones.

**Key differences from transition:**
- `in` transitions play independently alongside `out` transitions rather than reversing
- If a block is removed while an `in` transition is in progress, both transitions continue playing simultaneously
- If an `out` transition is aborted, all transitions restart from scratch

**Example:**
```svelte
<script>
  import { fade, fly } from 'svelte/transition';
  let visible = $state(false);
</script>

<label>
  <input type="checkbox" bind:checked={visible}>
  visible
</label>

{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```

In this example, when `visible` becomes true, the div flies in from 200px below. When `visible` becomes false, the div fades out. The transitions don't reverse each other—they play independently.

### animate
animate: directive for reordering animations in keyed each blocks; custom functions receive node and DOMRect positions, return css/tick callbacks with t (0-1) and u (1-t) parameters.

## Overview
Animations are triggered when contents of a keyed each block are reordered. Animations only run when the index of an existing data item changes, not when elements are added or removed. Animate directives must be on immediate children of keyed each blocks.

## Built-in and Custom Animations
Svelte provides built-in animation functions and supports custom animation functions.

```svelte
{#each list as item, index (item)}
	<li animate:flip>{item}</li>
{/each}
```

## Animation Parameters
Animations accept parameters as object literals:

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

## Custom Animation Functions
Custom animation functions receive `node`, an `animation` object with `from` and `to` DOMRect properties, and `params`. They return an object with optional `delay`, `duration`, `easing`, `css`, and `tick` properties.

The `css` method receives `t` (0 to 1 after easing) and `u` (1 - t), and is called repeatedly before animation begins. Svelte creates a web animation from the returned CSS.

```js
function whizz(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const d = Math.sqrt(dx * dx + dy * dy);
	
	return {
		delay: 0,
		duration: Math.sqrt(d) * 120,
		easing: cubicOut,
		css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
	};
}

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

Alternatively, return a `tick` function called during animation with same `t` and `u` arguments:

```js
function whizz(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const d = Math.sqrt(dx * dx + dy * dy);
	
	return {
		delay: 0,
		duration: Math.sqrt(d) * 120,
		easing: cubicOut,
		tick: (t, u) => Object.assign(node.style, { color: t > 0.5 ? 'Pink' : 'Blue' })
	};
}

{#each list as item, index (item)}
	<div animate:whizz>{item}</div>
{/each}
```

Prefer `css` over `tick` when possible — web animations run off the main thread and prevent jank on slower devices.

### style_directive
style: directive for shorthand CSS styling with dynamic values, multiple properties, !important modifier, and precedence over style attributes

The `style:` directive provides a shorthand for setting CSS styles on elements.

**Basic usage:**
```svelte
<div style:color="red">...</div>
<!-- equivalent to: <div style="color: red;">...</div> -->
```

**Dynamic values:**
```svelte
<div style:color={myColor}>...</div>
```

**Shorthand form** (uses variable with same name as property):
```svelte
<div style:color>...</div>
```

**Multiple styles:**
```svelte
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
```

**Important modifier:**
```svelte
<div style:color|important="red">...</div>
```

**Precedence:** When `style:` directives are combined with `style` attributes, directives take precedence even over `!important` properties:
```svelte
<div style:color="red" style="color: blue">This will be red</div>
<div style:color="red" style="color: blue !important">This will still be red</div>
```

### class
Two ways to set element classes: `class` attribute (supports strings, objects with truthy keys, arrays with truthy values, flattened nesting) and `class:` directive (conditional shorthand); prefer attribute form.

## Setting Classes on Elements

Two approaches: `class` attribute and `class:` directive.

### Class Attribute

**Primitive values:**
```svelte
<div class={large ? 'large' : 'small'}>...</div>
```

Note: Falsy values like `false` and `NaN` are stringified to `class="false"`, but `undefined`/`null` omit the attribute entirely. Future versions will omit all falsy values.

**Objects and arrays (Svelte 5.16+):**

Objects - truthy keys become classes:
```svelte
<script>
	let { cool } = $props();
</script>
<div class={{ cool, lame: !cool }}>...</div>
```

Arrays - truthy values combined:
```svelte
<div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
```

Arrays can nest arrays and objects (flattened by clsx), useful for combining local classes with props:
```svelte
<!-- Button.svelte -->
<button {...props} class={['cool-button', props.class]}>
	{@render props.children?.()}
</button>

<!-- App.svelte -->
<Button
	onclick={() => useTailwind = true}
	class={{ 'bg-blue-700 sm:w-1/2': useTailwind }}
>
	Accept the inevitability of Tailwind
</Button>
```

**Type safety (Svelte 5.19+):**
```svelte
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	const props: { class: ClassValue } = $props();
</script>
<div class={['original', props.class]}>...</div>
```

### Class Directive

`class:` directive for conditional classes (pre-5.16 approach):
```svelte
<!-- Equivalent to object form -->
<div class:cool={cool} class:lame={!cool}>...</div>

<!-- Shorthand when name matches value -->
<div class:cool class:lame={!cool}>...</div>
```

Recommendation: Use `class` attribute instead, it's more powerful and composable.

### await-expressions
Experimental async/await support in components (5.36+) with synchronized updates, parallel concurrency, boundary-based loading states, SSR support, and fork-based preloading; requires opt-in flag.

## Overview
As of Svelte 5.36, the `await` keyword can be used in three new places:
- Top level of component `<script>`
- Inside `$derived(...)` declarations
- Inside markup

Requires opt-in via `experimental.async: true` in `svelte.config.js`. Will be removed in Svelte 6.

## Synchronized Updates
When an `await` expression depends on state, UI updates wait for async work to complete, preventing inconsistent states:

```svelte
<script>
	let a = $state(1);
	let b = $state(2);
	async function add(a, b) {
		await new Promise((f) => setTimeout(f, 500));
		return a + b;
	}
</script>
<input type="number" bind:value={a}>
<input type="number" bind:value={b}>
<p>{a} + {b} = {await add(a, b)}</p>
```

Changing `a` won't update the paragraph until `add(a, b)` resolves. Updates can overlap — fast updates reflect while slow ones are ongoing.

## Concurrency
Multiple independent `await` expressions in markup run in parallel:
```svelte
<p>{await one()}</p>
<p>{await two()}</p>
```

Both functions execute simultaneously. Sequential `await` in `<script>` or async functions behave like normal JavaScript. Independent `$derived` expressions update independently but run sequentially on first creation (triggers `await_waterfall` warning).

## Loading States
Wrap content in `<svelte:boundary>` with `pending` snippet to show placeholder UI on first creation:
```svelte
<svelte:boundary pending={<p>Loading...</p>}>
	{await content()}
</svelte:boundary>
```

Use `$effect.pending()` to detect subsequent async work. Use `settled()` to wait for current update completion:
```js
import { tick, settled } from 'svelte';
async function onclick() {
	updating = true;
	await tick();
	color = 'octarine';
	answer = 42;
	await settled();
	updating = false;
}
```

## Error Handling
Errors in `await` expressions bubble to nearest error boundary.

## Server-Side Rendering
Svelte supports async SSR with `render(...)` API:
```js
import { render } from 'svelte/server';
import App from './App.svelte';
const { head, body } = await render(App);
```

If `<svelte:boundary>` with `pending` snippet is encountered during SSR, the pending snippet renders while content is ignored. All `await` expressions outside boundaries with pending snippets resolve before `render(...)` returns.

## Forking
The `fork(...)` API (added in 5.42) runs `await` expressions expected to happen soon, useful for preloading:
```svelte
<script>
	import { fork } from 'svelte';
	let open = $state(false);
	let pending = null;
	function preload() {
		pending ??= fork(() => { open = true; });
	}
	function discard() {
		pending?.discard();
		pending = null;
	}
</script>
<button
	onfocusin={preload}
	onfocusout={discard}
	onpointerenter={preload}
	onpointerleave={discard}
	onclick={() => {
		pending?.commit();
		pending = null;
		open = true;
	}}
>open menu</button>
{#if open}
	<Menu onclose={() => open = false} />
{/if}
```

## Caveats
Experimental feature — details subject to breaking changes outside semver major release. Effects run in different order when `experimental.async` is true: block effects run before `$effect.pre` or `beforeUpdate` in same component.

