`in:` and `out:` directives apply non-bidirectional transitions. Unlike `transition:`, an `in` transition continues playing alongside an `out` transition rather than reversing if the block is removed mid-transition.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```