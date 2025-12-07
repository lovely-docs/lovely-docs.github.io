

## Pages

### svelte-boundary
Error boundary element with pending/failed snippets and onerror handler; catches rendering/effect errors only, not event handler or external async errors.

## svelte:boundary

A special element that creates error boundaries and handles async state in Svelte components (added in 5.3.0).

### Purpose
- Wall off parts of your app to handle errors during rendering or effects
- Show pending UI while `await` expressions resolve
- Provide error UI when rendering fails

**Important limitation**: Only catches errors during rendering and effects. Errors in event handlers, setTimeout, or other async work outside the rendering process are NOT caught.

### Properties

**pending** - A snippet shown when the boundary is first created, visible until all `await` expressions inside resolve. Not shown for subsequent async updates (use `$effect.pending()` for those instead).

```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
```

**failed** - A snippet rendered when an error is thrown, receives `error` and `reset` function arguments. When a boundary handles an error, its existing content is removed.

```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>oops! try again</button>
	{/snippet}
</svelte:boundary>
```

Can also be passed explicitly: `<svelte:boundary {failed}>...</svelte:boundary>`

**onerror** - A function called with `error` and `reset` arguments. Useful for error reporting or managing error state outside the boundary.

```svelte
<script>
	let error = $state(null);
	let reset = $state(() => {});
	function onerror(e, r) {
		error = e;
		reset = r;
	}
</script>

<svelte:boundary {onerror}>
	<FlakyComponent />
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null;
		reset();
	}}>oops! try again</button>
{/if}
```

Errors thrown inside `onerror` (or rethrown errors) propagate to parent boundaries if they exist.

### svelte-window
Special element for attaching window event listeners and binding to window properties (innerWidth, innerHeight, outerWidth, outerHeight, scrollX, scrollY, online, devicePixelRatio) with automatic cleanup; must be top-level; scrollX/scrollY are writable, others readonly.

## `<svelte:window>` Element

Adds event listeners to the `window` object with automatic cleanup on component destruction and SSR safety.

**Usage:**
```svelte
<svelte:window onevent={handler} />
<svelte:window bind:prop={value} />
```

**Constraints:**
- Must appear at top level of component only (not inside blocks or elements)

**Event Listeners:**
Attach any window event handler using `onevent={handler}` syntax:
```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

**Bindable Properties (readonly except scrollX/scrollY):**
- `innerWidth`, `innerHeight`
- `outerWidth`, `outerHeight`
- `scrollX`, `scrollY` (writable)
- `online` (alias for `window.navigator.onLine`)
- `devicePixelRatio`

**Example:**
```svelte
<svelte:window bind:scrollY={y} />
```

**Note:** Initial values of `scrollX`/`scrollY` don't trigger scrolling (accessibility). Use `scrollTo()` in `$effect` if you need to scroll on mount.

### svelte-document
Special element for attaching event listeners and actions to document; supports binding activeElement, fullscreenElement, pointerLockElement, visibilityState; top-level only.

## `<svelte:document>` Element

Allows you to add event listeners to `document` and use actions on it, similar to `<svelte:window>`.

**Usage:**
```svelte
<svelte:document onevent={handler} />
<svelte:document bind:prop={value} />
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

**Constraints:**
- May only appear at the top level of your component
- Must never be inside a block or element

**Bindable Properties (readonly):**
- `activeElement`
- `fullscreenElement`
- `pointerLockElement`
- `visibilityState`

**Use Cases:**
Listen to document events like `visibilitychange` that don't fire on `window`, and bind to document properties.

### svelte-body
Special element for attaching event listeners and actions to document.body; supports body-specific events like mouseenter/mouseleave; top-level only.

The `<svelte:body>` element allows you to attach event listeners to `document.body` and use actions on the body element. Unlike `<svelte:window>`, it captures events like `mouseenter` and `mouseleave` that don't fire on the window object.

Usage:
```svelte
<svelte:body onevent={handler} />
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

Constraints: This element may only appear at the top level of your component and must never be inside a block or element.

### svelte-head
Special element for inserting content into document.head; top-level only; supports title and meta tags for SEO.

## `<svelte:head>`

Inserts elements into `document.head`. During server-side rendering, head content is exposed separately from body content.

**Constraints:**
- May only appear at the top level of a component
- Must never be inside a block or element

**Example:**
```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```

### svelte-element
Dynamic element renderer that takes tag name from `this` prop; supports properties/listeners but only `bind:this` binding; errors on void elements with children; use `xmlns` for explicit namespace.

## `<svelte:element>` Component

Renders a DOM element whose tag name is determined at runtime via the `this` prop.

**Purpose**: Useful when the element type is unknown at author time, such as when it comes from a CMS or dynamic source.

**Basic usage**:
```svelte
<svelte:element this={expression} />
```

**Key behaviors**:
- If `this` is nullish, the element and its children are not rendered
- Only `bind:this` binding is supported; other Svelte bindings don't work with generic elements
- All properties and event listeners are applied to the rendered element
- `this` must be a valid DOM element tag name (e.g., `div`, `span`, `hr`); invalid values like `#text` or `svelte:head` will not work

**Void element handling**: If `this` is a void element (e.g., `br`, `hr`) and the component has child elements, a runtime error is thrown in development mode:
```svelte
<script>
	let tag = $state('hr');
</script>

<svelte:element this={tag}>
	This text cannot appear inside an hr element
</svelte:element>
```

**Namespace handling**: Svelte attempts to infer the correct namespace from context, but you can make it explicit with the `xmlns` attribute:
```svelte
<svelte:element this={tag} xmlns="http://www.w3.org/2000/svg" />
```

### svelte-options
Element for per-component compiler options: runes mode, namespace, custom element config, CSS injection; deprecated immutable/accessors.

The `<svelte:options>` element specifies per-component compiler options.

**Options:**
- `runes={true|false}` — forces component into runes mode or legacy mode
- `namespace="html|svg|mathml"` — namespace where component is used (default: "html")
- `customElement={...}` — options for compiling as custom element; if string, used as tag name
- `css="injected"` — injects styles inline; during SSR as `<style>` tag in head, during CSR via JavaScript

**Deprecated in Svelte 5 (non-functional in runes mode):**
- `immutable={true|false}` — enables/disables referential equality checks for change detection
- `accessors={true|false}` — adds/removes getters and setters for component props

**Example:**
```svelte
<svelte:options customElement="my-custom-element" />
```

