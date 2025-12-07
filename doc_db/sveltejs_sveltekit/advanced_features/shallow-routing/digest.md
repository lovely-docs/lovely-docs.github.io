## Shallow Routing

Create history entries without navigating using `pushState` and `replaceState` functions. Useful for modals and overlays that should be dismissible via back button.

### Basic Usage

```svelte
import { pushState } from '$app/navigation';
import { page } from '$app/state';

function showModal() {
  pushState('', { showModal: true });
}
```

Access state via `page.state`. First argument to `pushState` is relative URL (use `''` to stay on current URL). Second argument is the new page state object.

Use `replaceState` instead of `pushState` to set state without creating a new history entry.

Type-safe state by declaring `App.PageState` interface in `src/app.d.ts`.

### Loading Data for Routes

When rendering another `+page.svelte` inside current page (e.g., photo detail in modal), preload its data using `preloadData`:

```svelte
import { preloadData, pushState, goto } from '$app/navigation';
import { page } from '$app/state';
import PhotoPage from './[id]/+page.svelte';

let { data } = $props();
```

```svelte
{#each data.thumbnails as thumbnail}
  <a
    href="/photos/{thumbnail.id}"
    onclick={async (e) => {
      if (innerWidth < 640 || e.shiftKey || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      const result = await preloadData(e.currentTarget.href);
      if (result.type === 'loaded' && result.status === 200) {
        pushState(result.data.href, { selected: result.data });
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

If element uses `data-sveltekit-preload-data`, the data will already be requested and `preloadData` reuses that request.

### Caveats

- During SSR, `page.state` is always empty
- On first page load, state is not applied until user navigates
- Requires JavaScript to work; provide fallback behavior