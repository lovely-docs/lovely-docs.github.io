## Snapshots

Preserve ephemeral DOM state (scroll positions, form input values, etc.) across navigation by exporting a `snapshot` object from `+page.svelte` or `+layout.svelte`.

The snapshot object must have two methods:
- `capture()`: Called before navigation, returns the state to preserve
- `restore(value)`: Called when navigating back, receives the captured state

The captured data must be JSON-serializable to persist in `sessionStorage`, allowing restoration on page reload or back navigation from external sites.

Example:
```svelte
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>

<textarea bind:value={comment} />
```

Avoid capturing large objects as they remain in memory for the session duration and may exceed `sessionStorage` limits.