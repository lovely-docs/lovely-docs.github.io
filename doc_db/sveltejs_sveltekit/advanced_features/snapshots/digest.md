Preserve ephemeral DOM state (scroll positions, form input values, etc.) across navigation using snapshots.

Export a `snapshot` object from `+page.svelte` or `+layout.svelte` with `capture` and `restore` methods:

```svelte
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<button>Post comment</button>
</form>
```

When navigating away, `capture()` is called immediately before the page updates and its return value is stored in the browser's history stack. When navigating back, `restore()` is called with the stored value as soon as the page updates.

Data must be JSON-serializable to persist to `sessionStorage`, allowing restoration on page reload or navigation back from external sites. Avoid capturing very large objects as they remain in memory for the session duration and may exceed `sessionStorage` limits.