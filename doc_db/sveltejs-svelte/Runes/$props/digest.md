## $props rune

Receive component inputs (props) using the `$props()` rune:

```svelte
<script>
	let { adjective } = $props();
</script>

<p>this component is {adjective}</p>
```

### Fallback values
Provide defaults for props not set by parent:
```js
let { adjective = 'happy' } = $props();
```

### Renaming props
Rename props using destructuring (useful for keywords or invalid identifiers):
```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

### Rest props
Capture remaining props:
```js
let { a, b, c, ...others } = $props();
```

### Updating props
Props update reactively when parent changes them. Child can temporarily reassign but should not mutate props unless they're bindable. Mutating regular object props has no effect. Mutating reactive state proxy props causes updates but triggers an `ownership_invalid_mutation` warning. Fallback values are not reactive proxies, so mutations have no effect.

### Type safety
Add type annotations for better IDE support:
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
Generate unique component instance IDs (consistent during hydration):
```svelte
<script>
	const uid = $props.id();
</script>

<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```