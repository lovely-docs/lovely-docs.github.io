Star rating component with customizable items, half-ratings, readonly/disabled modes, form support, and full keyboard/RTL accessibility.

**Basic usage:**
```svelte
<script lang="ts">
  import { RatingGroup } from "bits-ui";
  let value = $state(3);
</script>
<RatingGroup.Root bind:value max={5}>
  {#snippet children({ items })}
    {#each items as item (item.index)}
      <RatingGroup.Item index={item.index}>
        {#if item.state === "active"}⭐{:else}☆{/if}
      </RatingGroup.Item>
    {/each}
  {/snippet}
</RatingGroup.Root>
```

**Key features:**
- `max` (default 5), `min` (default 0) for rating range
- `allowHalf` for 0.5 increments
- `readonly`, `disabled` states
- `hoverPreview` (default false) for preview on hover
- `name` prop renders hidden input for forms
- Two-way binding or fully controlled via function binding
- RTL support with auto-reversed arrow keys
- Keyboard: type number (3 or 2.5), arrows, Home/End, PageUp/PageDown
- ARIA slider pattern with `aria-valuetext` customization