The `<svelte:fragment>` element allows you to place content in a named slot without wrapping it in a container DOM element, preserving the document's flow layout.

**Example:**
```svelte
<!-- Widget.svelte -->
<div>
	<slot name="header">No header was provided</slot>
	<p>Some content between header and footer</p>
	<slot name="footer" />
</div>

<!-- App.svelte -->
<Widget>
	<h1 slot="header">Hello</h1>
	<svelte:fragment slot="footer">
		<p>All rights reserved.</p>
		<p>Copyright (c) 2019 Svelte Industries</p>
	</svelte:fragment>
</Widget>
```

**Note:** This is a legacy feature. In Svelte 5+, snippets don't create a wrapping element, making this concept obsolete.