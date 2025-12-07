Special element that inserts content into `document.head`. Must be at component top level, not inside blocks/elements. Useful for setting page title and meta tags.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO description" />
</svelte:head>
```