## $props rune

Receive component inputs using the `$props()` rune:

```svelte
<script>
	let { adjective } = $props();
</script>

<p>this component is {adjective}</p>
```

### Fallback values
Provide defaults for props that may not be set:
```js
let { adjective = 'happy' } = $props();
```

### Renaming props
Use destructuring to rename props (useful for keywords or invalid identifiers):
```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

### Rest props
Capture remaining props:
```js
let { a, b, c, ...others } = $props();
```

### Updating props
Props update reactively when changed by parent. Child can temporarily reassign but should not mutate props unless they are bindable. Regular object mutations have no effect. Reactive state proxy mutations will work but trigger an `ownership_invalid_mutation` warning.

### Type safety
Add type annotations for safety:
```svelte
<script lang="ts">
	interface Props {
		adjective: string;
	}
	let { adjective }: Props = $props();
</script>
```

Or with JSDoc:
```svelte
<script>
	/** @type {{ adjective: string }} */
	let { adjective } = $props();
</script>
```

### $props.id()
Generate a unique ID per component instance (consistent during hydration):
```svelte
<script>
	const uid = $props.id();
</script>

<label for="{uid}-firstname">First Name: </label>
<input id="{uid}-firstname" type="text" />
```