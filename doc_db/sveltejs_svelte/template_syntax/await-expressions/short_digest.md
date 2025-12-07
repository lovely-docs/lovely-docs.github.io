## Await in Components (Svelte 5.36+)
Enable with `experimental.async: true` in config. Use `await` in `<script>`, `$derived()`, and markup.

**Synchronized updates**: UI waits for async completion to prevent inconsistent states.

**Concurrency**: Multiple independent `await` in markup run in parallel; sequential ones in `<script>` behave normally.

**Loading states**: Use `<svelte:boundary pending={...}>` for placeholders, `$effect.pending()` for subsequent updates, `settled()` to wait for completion.

**SSR**: `await render(App)` supports async rendering; pending snippets render during SSR.

**Forking**: `fork(() => {...})` preloads expected async work with `commit()` or `discard()`.

Requires opt-in; removed in Svelte 6.