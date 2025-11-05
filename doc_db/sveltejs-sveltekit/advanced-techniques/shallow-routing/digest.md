## Shallow Routing

Create history entries without navigating using `pushState()` and `replaceState()` from `$app/navigation`. This enables patterns like history-driven modals that can be dismissed by navigating back.

### Basic Usage

```svelte
<script>
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';

	function showModal() {
		pushState('', { showModal: true });
	}
</script>

{#if page.state.showModal}
	<Modal close={() => history.back()} />
{/if}
```

The first argument to `pushState` is a relative URL (use `''` to stay on current URL). The second argument is the new page state, accessible via `page.state`. Use `replaceState` instead to set state without creating a new history entry.

### Loading Data for Routes

When rendering another `+page.svelte` inside the current page via shallow routing, preload its data using `preloadData()`:

```svelte
<script>
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data } = $props();
</script>

{#each data.thumbnails as thumbnail}
	<a
		href="/photos/{thumbnail.id}"
		onclick={async (e) => {
			if (innerWidth < 640 || e.shiftKey || e.metaKey || e.ctrlKey) return;
			e.preventDefault();

			const result = await preloadData(e.currentTarget.href);
			if (result.type === 'loaded' && result.status === 200) {
				pushState(e.currentTarget.href, { selected: result.data });
			} else {
				goto(e.currentTarget.href);
			}
		}}
	>
		<img alt={thumbnail.alt} src={thumbnail.src} />
	</a>
{/each}

{#if page.state.selected}
	<Modal onclose={() => history.back()}>
		<PhotoPage data={page.state.selected} />
	</Modal>
{/if}
```

If the link element uses `data-sveltekit-preload-data`, the data will already be requested and `preloadData` will reuse that request.

### Important Notes

- `page.state` is always empty during server-side rendering and on initial page load
- Shallow routing requires JavaScript; provide fallback behavior for when it's unavailable
- Make page state type-safe by declaring an `App.PageState` interface in `src/app.d.ts`