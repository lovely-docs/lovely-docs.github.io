Shallow routing allows you to create history entries without navigating, useful for modals and overlays that users can dismiss by navigating back.

**Core Functions:**
- `pushState(url, state)` - Creates a new history entry with associated state
- `replaceState(url, state)` - Sets state without creating a new history entry
- `preloadData(href)` - Loads data for a route before navigating

**Example - History-driven modal:**
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

**Example - Shallow routing with data loading:**
```svelte
<script>
  import { preloadData, pushState, goto } from '$app/navigation';
  import { page } from '$app/state';
</script>

<a href="/photos/{id}" onclick={async (e) => {
  e.preventDefault();
  const result = await preloadData(e.currentTarget.href);
  if (result.type === 'loaded' && result.status === 200) {
    pushState(e.currentTarget.href, { selected: result.data });
  } else {
    goto(e.currentTarget.href);
  }
}}>
  <img src={thumbnail.src} />
</a>

{#if page.state.selected}
  <Modal onclose={() => history.back()}>
    <PhotoPage data={page.state.selected} />
  </Modal>
{/if}
```

**State Access:**
- Access via `page.state` from `$app/state` (SvelteKit 2.12+)
- Make type-safe by declaring `App.PageState` interface in `src/app.d.ts`

**Caveats:**
- During SSR, `page.state` is always empty
- State is not applied on page reload or when landing on a page
- Requires JavaScript to work