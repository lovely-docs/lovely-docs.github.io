## Receiving Props

Use the `$props()` rune to receive component inputs. Destructure to extract specific props:

```svelte
<script>
	let { adjective } = $props();
</script>

<p>this component is {adjective}</p>
```

## Fallback Values

Provide defaults for props that may not be set:

```js
let { adjective = 'happy' } = $props();
```

Fallback values are not reactive state proxies, so mutations won't trigger updates.

## Renaming Props

Rename props using destructuring syntax (useful for invalid identifiers or keywords):

```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

## Rest Props

Capture remaining props with rest syntax:

```js
let { a, b, c, ...others } = $props();
```

## Updating Props

Props update reactively when the parent changes them. Child components can temporarily reassign props but should not mutate them unless they are bindable. Mutating regular objects has no effect. Mutating reactive state proxies will work but triggers an `ownership_invalid_mutation` warning. Use callback props or `$bindable` to communicate changes instead.

## Type Safety

Add type annotations for better IDE support and documentation:

```svelte
<script lang="ts">
	interface Props {
		adjective: string;
	}
	let { adjective }: Props = $props();
</script>
```

## $props.id()

Generate a unique ID per component instance (consistent during hydration):

```svelte
<script>
	const uid = $props.id();
</script>

<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```

Useful for linking elements via `for`, `aria-labelledby`, etc.