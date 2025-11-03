The `in:` and `out:` directives apply transitions that are not bidirectional, unlike the `transition:` directive. When a block is outroed while an `in` transition is in progress, the `in` transition continues playing alongside the `out` transition rather than reversing. If an `out` transition is aborted, transitions restart from scratch.

Example:
```svelte
<script>
  import { fade, fly } from 'svelte/transition';
  let visible = $state(false);
</script>

<label>
  <input type="checkbox" bind:checked={visible}>
  visible
</label>

{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```

The element flies in with a 200px vertical offset and fades out when the condition becomes false.