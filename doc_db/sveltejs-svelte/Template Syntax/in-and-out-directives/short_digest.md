`in:` and `out:` directives apply non-bidirectional transitions. Unlike `transition:`, the `in` transition continues playing alongside `out` rather than reversing if the block is outroed mid-transition.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```