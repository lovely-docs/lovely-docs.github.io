## Shallow Routing

Create history entries without navigating using `pushState` (new entry) or `replaceState` (no entry). Access state via `page.state`.

```svelte
import { pushState } from '$app/navigation';
import { page } from '$app/state';

pushState('', { showModal: true }); // relative URL, state object
```

For loading data: use `preloadData` to fetch `+page.svelte` data before rendering in modal.

```svelte
const result = await preloadData(href);
if (result.type === 'loaded' && result.status === 200) {
  pushState(href, { selected: result.data });
}
```

Type-safe state with `App.PageState` interface. Requires JavaScript; `page.state` is empty during SSR and on initial page load.