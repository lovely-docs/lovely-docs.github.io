Only one top-level `<style>` tag is allowed per component. However, you can nest `<style>` tags inside other elements or logic blocks. When nested, the style tag is inserted as-is into the DOM without any scoping or processing applied.

```svelte
<div>
	<style>
		div {
			color: red; /* applies to all div elements in the DOM */
		}
	</style>
</div>
```

This means nested styles will affect the entire document, not just the component.