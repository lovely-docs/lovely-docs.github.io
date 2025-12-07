**in: and out: directives** create unidirectional transitions (unlike `transition:` which is bidirectional). An `in` transition plays alongside an `out` transition without reversing; if aborted, transitions restart from scratch.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```