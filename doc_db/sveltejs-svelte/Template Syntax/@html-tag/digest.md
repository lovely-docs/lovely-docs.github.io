The `{@html ...}` tag injects raw HTML into a component:

```svelte
<article>
	{@html content}
</article>
```

**Security**: Always escape the passed string or only use values under your control to prevent XSS attacks. Never render unsanitized content.

**Valid HTML requirement**: The expression must be valid standalone HTML. This will not work:
```svelte
{@html '<div>'}content{@html '</div>'}
```

It also cannot compile Svelte code.

**Styling**: Content rendered with `{@html ...}` is invisible to Svelte and won't receive scoped styles. Scoped style rules targeting elements inside injected HTML won't work. Use the `:global` modifier instead:

```svelte
<style>
	article :global {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```