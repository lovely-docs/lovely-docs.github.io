Shallow routing creates history entries without navigation using `pushState()` and `replaceState()`. Use `preloadData()` to load route data before showing overlays. Access state via `page.state` from `$app/state`. State is empty during SSR and page reloads.

**Example:**
```svelte
<script>
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
</script>

{#if page.state.showModal}
  <Modal close={() => history.back()} />
{/if}

<button onclick={() => pushState('', { showModal: true })}>
  Show Modal
</button>
```