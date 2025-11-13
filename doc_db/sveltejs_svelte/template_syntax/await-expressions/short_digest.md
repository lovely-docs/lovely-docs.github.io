## Await Expressions (Experimental)

Enable with `experimental.async: true` in `svelte.config.js`. Use `await` in `<script>`, `$derived()`, and markup.

**Synchronized updates**: UI waits for async work to complete, preventing inconsistent states.

**Concurrency**: Independent `await` in markup run in parallel; sequential `await` in `<script>` behave like normal JavaScript.

**Loading states**: Use `<svelte:boundary pending>` for initial load UI, `$effect.pending()` for subsequent updates, `settled()` to wait for completion.

**Forking**: `fork()` API runs expected `await` expressions in advance for preloading.