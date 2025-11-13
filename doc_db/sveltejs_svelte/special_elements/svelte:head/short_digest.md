`<svelte:head>` inserts elements into `document.head`. Must appear only at component top level, never inside blocks or elements.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```