## Await Expressions (Experimental)

As of Svelte 5.36, `await` can be used in three new places:
- Top level of component `<script>`
- Inside `$derived(...)` declarations
- Inside markup

Enable with `experimental.async: true` in `svelte.config.js`. This flag will be removed in Svelte 6.

### Synchronized Updates

When an `await` expression depends on state, UI updates wait for the async work to complete, preventing inconsistent states:

```svelte
<script>
  let a = $state(1);
  async function add(a, b) {
    await new Promise((f) => setTimeout(f, 500));
    return a + b;
  }
</script>
<input bind:value={a}>
<p>{a} + 2 = {await add(a, 2)}</p>
```

Changing `a` won't update the result until `add()` resolves. Multiple updates can overlap.

### Concurrency

Independent `await` expressions in markup run in parallel:
```svelte
<p>{await one()}</p>
<p>{await two()}</p>
```

Sequential `await` in `<script>` or async functions behave like normal JavaScript. Independent `$derived` expressions update independently but run sequentially on first creation (triggers `await_waterfall` warning).

### Loading States

Use `<svelte:boundary>` with `pending` snippet for placeholder UI during initial load. For subsequent updates, use `$effect.pending()` to detect async work or `settled()` to wait for completion:

```js
import { tick, settled } from 'svelte';
async function onclick() {
  updating = true;
  await tick();
  color = 'octarine';
  await settled();
  updating = false;
}
```

### Error Handling

Errors bubble to the nearest error boundary.

### Server-Side Rendering

Await the `render()` return value for async SSR. `<svelte:boundary>` with `pending` renders the snippet while content loads. Other `await` expressions resolve before returning.

### Forking

The `fork()` API (5.42+) runs expected `await` expressions in advance, useful for preloading:

```svelte
<script>
  import { fork } from 'svelte';
  let pending = null;
  function preload() {
    pending ??= fork(() => { open = true; });
  }
  function discard() {
    pending?.discard();
  }
</script>
<button onfocusin={preload} onfocusout={discard} onclick={() => pending?.commit()}>
  open menu
</button>
```

### Caveats

Experimental feature subject to breaking changes outside semver major releases. Block effects now run before `$effect.pre` or `beforeUpdate` when `experimental.async` is true.