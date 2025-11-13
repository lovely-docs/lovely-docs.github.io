## Compiling to Custom Elements

Svelte components can be compiled to web components using `customElement: true` compiler option. Specify a tag name with `<svelte:options customElement="my-element" />`. Access the host element via the `$host` rune.

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

Use as regular DOM elements with props exposed as properties and attributes:

```js
const el = document.querySelector('my-element');
console.log(el.name);
el.name = 'everybody';
```

## Lifecycle

The Svelte component is created in the next tick after `connectedCallback`. Properties assigned before DOM insertion are saved and applied on creation. Exported functions are only available after mounting. Shadow DOM updates happen in the next tick, allowing batched updates. The component is destroyed in the next tick after `disconnectedCallback`.

## Advanced Configuration

Define `customElement` as an object in `<svelte:options>`:

- `tag: string` - custom element tag name, auto-registers if set
- `shadow: "none"` - disables shadow root (styles not encapsulated, slots unavailable)
- `props` - configure individual properties:
  - `attribute: string` - custom attribute name (default: lowercase property name)
  - `reflect: boolean` - reflect prop changes back to DOM
  - `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'` - for attribute conversion
- `extend: function` - receives custom element class, returns extended class for lifecycle customization or ElementInternals integration

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
```

## Caveats

- Styles are encapsulated in shadow DOM (unless `shadow: "none"`); global styles don't apply
- Styles are inlined as JavaScript strings, not extracted to CSS files
- Not suitable for server-side rendering
- Slotted content renders eagerly in DOM (not lazily like Svelte)
- `let:` directive has no effect
- Context cannot be shared across custom elements
- Properties/attributes starting with `on` are interpreted as event listeners
- Requires polyfills for older browsers