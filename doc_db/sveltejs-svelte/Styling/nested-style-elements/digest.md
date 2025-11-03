A component can only have one top-level `<style>` tag. However, you can place `<style>` tags nested inside other elements or logic blocks. When nested, the style tag is inserted as-is into the DOM without any scoping or processing applied.

```svelte
<div>
	<style>
		div {
			color: red;
		}
	</style>
</div>
```

In this example, the nested `<style>` tag will apply to all `<div>` elements in the entire DOM, not just the component, since no scoping is performed on nested styles.