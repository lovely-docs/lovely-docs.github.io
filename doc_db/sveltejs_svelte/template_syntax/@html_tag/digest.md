The `{@html ...}` tag injects raw HTML into a component:

```svelte
<article>
	{@html content}
</article>
```

**Security**: Always escape the passed string or only use values under your control to prevent XSS attacks. Never render unsanitized content.

**Valid HTML requirement**: The expression must be valid standalone HTML. This fails because `</div>` alone is invalid:
```svelte
{@html '<div>'}content{@html '</div>'}
```

The tag does not compile Svelte code.

**Styling**: HTML rendered this way is invisible to Svelte and won't receive scoped styles. Scoped style rules won't apply to injected HTML content. Use the `:global` modifier to style the container:

```svelte
<style>
	article :global {
		a { color: hotpink }
		img { width: 100% }
	}
</style>
```