

## Pages

### basic_markup
Svelte template syntax for markup: tags, attributes with expressions, event listeners, text interpolation, and comments.

## Tags
Lowercase tags are HTML elements, capitalized/dot-notation tags are components.

## Attributes & Props
Attributes support expressions: `<button disabled={!clickable}>`, shorthand `{name}`, and spreading `{...things}`. Boolean attributes are included if truthy. Props work the same way.

## Events
Listen with `on` prefix: `<button onclick={handler}>`. Case-sensitive. Certain events are delegated to root for performance; dispatch with `{ bubbles: true }` and avoid `stopPropagation`.

## Text expressions
```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>
```
Null/undefined omitted, others coerced to strings. Use `{@html string}` for HTML.

## Comments
`<!-- svelte-ignore a11y_autofocus -->` disables warnings. `<!-- @component ... -->` shows on hover.

### if-blocks
Conditional rendering in Svelte templates using if/else if/else blocks.

Use `{#if expression}...{/if}` to conditionally render content. Chain conditions with `{:else if expression}` and optionally end with `{:else}`.

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

### each_block
The each block iterates over arrays and iterables with optional indexing, keying for efficient updates, destructuring, and else fallback.

Iterate with `{#each expression as name, index (key)}...{/each}`. Use keys for intelligent list updates. Supports destructuring, rendering n times with `{#each { length: n }}`, and `{:else}` for empty lists.

```svelte
{#each items as { id, name }, i (id)}
	<li>{i + 1}: {name}</li>
{/each}

{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks!</p>
{/each}
```

### key
The {#key} block destroys and recreates its contents when an expression value changes, useful for component reinitialisation and triggering transitions.

{#key expression} destroys and recreates contents when expression changes, causing component reinitialisation and triggering transitions:

```svelte
{#key value}
	<Component />
{/key}
```

### await_blocks
Await blocks handle Promise states with optional pending, then, and catch branches.

Await blocks branch on Promise states (pending, fulfilled, rejected). Omit `catch` or pending block as needed. Use with dynamic imports for lazy component loading.

### snippet
Snippets are reusable markup blocks that can be passed as component props and rendered with {@render}, replacing Svelte 4 slots.

## Snippets

Reusable markup blocks declared with `{#snippet name(params)}...{/snippet}` and rendered with `{@render name()}`.

**Scope**: Reference values from script/parent blocks; visible to siblings and children in same lexical scope.

**Passing to components**: Snippets are values passed as props. Snippets declared inside a component implicitly become props; non-snippet content becomes `children` snippet.

**Optional snippets**: Use `{@render children?.()}` or conditional rendering.

**Typing**: `import type { Snippet } from 'svelte'` and use `Snippet<[ParamType]>` for type safety.

**Exporting**: Top-level snippets can export from `<script module>` (Svelte 5.5.0+).

**Programmatic**: Use `createRawSnippet` API for advanced cases.

Replaces deprecated Svelte 4 slots.

### @render
The {@render} tag renders snippets, supporting expressions and optional chaining for undefined snippets.

Use `{@render ...}` to render snippets. Supports arbitrary expressions and optional chaining for undefined snippets:

```svelte
{@render sum(1, 2)}
{@render (cool ? coolSnippet : lameSnippet)()}
{@render children?.()}
```

### @html_tag
Inject raw HTML into components using {@html ...} with proper sanitization and :global styling for injected content.

The `{@html ...}` tag injects raw HTML. Always sanitize input to prevent XSS. The expression must be valid standalone HTML and won't receive scoped styles—use `:global` to style injected content:

```svelte
<article>
	{@html content}
</article>

<style>
	article :global {
		a { color: hotpink }
	}
</style>
```

### @attach_directive
Directive for attaching reactive functions to DOM elements with lifecycle management.

`{@attach}` runs functions when elements mount or reactive state updates, with optional cleanup. Supports factories, inline definitions, component spreading, and provides utilities for programmatic creation and action conversion.

```svelte
function tooltip(content) {
  return (element) => {
    const tooltip = tippy(element, { content });
    return tooltip.destroy;
  };
}

<button {@attach tooltip(content)}>Hover me</button>
```

### @const
Define local constants within block scopes using {@const ...}

The `{@const ...}` tag defines a local constant within a block scope. Can only be used as an immediate child of blocks like `{#if}`, `{#each}`, `{#snippet}`, components, or `<svelte:boundary>`.

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{box.width} * {box.height} = {area}
{/each}
```

### @debug
Debug tag for logging variable changes and pausing execution in Svelte templates.

`{@debug ...}` logs variable values on change and pauses execution with devtools open. Accepts comma-separated variable names only:
```svelte
{@debug user}
{@debug user1, user2, user3}
```
Use `{@debug}` without arguments to trigger on any state change.

### bind
Two-way data binding directive that allows child-to-parent data flow with support for inputs, selects, media elements, and component props.

## Two-way binding with `bind:`

Enables data flow from child to parent. Syntax: `bind:property={expression}` or `bind:property` if names match.

**Input bindings:** `bind:value` (coerces to number), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox groups), `bind:files`

**Select:** `bind:value` on `<select>` or `<select multiple>` (returns array)

**Media:** `<audio>`/`<video>` two-way: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

**Other:** `<img>` readonly dimensions, `<details bind:open>`, contenteditable `innerHTML`/`innerText`/`textContent`, element dimensions (`clientWidth`, `offsetHeight`, etc.)

**Function bindings (5.9.0+):** `bind:value={() => value, (v) => value = v.toLowerCase()}`

**Component props:** Mark with `$bindable()` rune, then use `bind:property={variable}` on component instances

**bind:this:** Get DOM/component references

### use_directive
The use: directive attaches lifecycle-managed functions to DOM elements.

Actions are functions called on element mount using `use:` directive with `$effect` for setup/teardown. They accept optional arguments and can dispatch custom events. Type with `Action<NodeType, ParamType, EventHandlers>`.

### transition
Transitions animate elements entering/leaving the DOM with built-in or custom functions, supporting parameters, local/global scope, and lifecycle events.

## Transitions

Triggered when elements enter/leave DOM. Bidirectional and reversible.

```svelte
<div transition:fade={{ duration: 2000 }}>fades in and out</div>
```

**Local vs Global**: Local by default (only when block changes). Use `|global` for parent changes.

**Custom functions** return object with `delay`, `duration`, `easing`, `css`, `tick`. Use `css` for performance:

```js
function whoosh(node, params) {
  return {
    duration: 400,
    css: (t, u) => `transform: scale(${t})`
  };
}
```

**Events**: `introstart`, `introend`, `outrostart`, `outroend`

### in_and_out_directives
Non-bidirectional transition directives that allow separate entrance and exit animations without reversing.

`in:` and `out:` directives apply non-bidirectional transitions. Unlike `transition:`, an `in` transition continues playing alongside an `out` transition rather than reversing if the block is removed mid-transition.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```

### animate
Svelte's animate directive triggers animations when keyed each block items are reordered, supporting both built-in and custom animation functions with CSS or tick-based implementations.

## Animate Directive

Triggers animations when keyed each block contents are reordered (not on add/remove). Use built-in functions or custom ones.

**Parameters:**
```svelte
<li animate:flip={{ delay: 500 }}>{item}</li>
```

**Custom function signature:**
```js
function animate(node, { from: DOMRect, to: DOMRect }, params) {
	return {
		delay?: number,
		duration?: number,
		easing?: (t: number) => number,
		css?: (t: number, u: number) => string,  // preferred
		tick?: (t: number, u: number) => void
	};
}
```

`t` ranges 0-1 after easing, `u` = 1 - t. Use `css` for web animations (off main thread), `tick` for imperative updates.

### style_directive
Shorthand directive for setting inline styles on elements with support for dynamic values and important modifier.

The `style:` directive sets inline styles with shorthand syntax. Supports dynamic values, multiple styles, and `|important` modifier. Takes precedence over `style` attributes and `!important`.

```svelte
<div style:color="red" style:width={w} style:background-color|important={bg}>...</div>
```

### class
How to set classes on elements using the class attribute (with objects/arrays) or the class: directive.

## Setting Classes

**Attribute approach (preferred):**
- Primitive: `class={condition ? 'large' : 'small'}`
- Objects: `class={{ cool, lame: !cool }}`
- Arrays: `class={[faded && 'saturate-0', large && 'scale-200']}`
- Type-safe: `import type { ClassValue } from 'svelte/elements'`

**Directive approach (legacy):**
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
<!-- or shorthand -->
<div class:cool class:lame={!cool}>...</div>
```

### await-expressions
Experimental feature enabling await expressions in component scripts, derived declarations, and markup with synchronized updates and concurrency control.

## Await Expressions (Experimental)

Enable with `experimental.async: true` in `svelte.config.js`. Use `await` in `<script>`, `$derived()`, and markup.

**Synchronized updates**: UI waits for async work to complete, preventing inconsistent states.

**Concurrency**: Independent `await` in markup run in parallel; sequential `await` in `<script>` behave like normal JavaScript.

**Loading states**: Use `<svelte:boundary pending>` for initial load UI, `$effect.pending()` for subsequent updates, `settled()` to wait for completion.

**Forking**: `fork()` API runs expected `await` expressions in advance for preloading.

