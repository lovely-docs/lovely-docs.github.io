## RatingGroup Component

Customizable rating component with stars or custom items.

### Basic Usage
```svelte
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

### Key Features
- **State**: Two-way binding with `bind:value` or fully controlled with function bindings
- **Half ratings**: `allowHalf` prop enables 3.5-star ratings
- **Modes**: `readonly`, `disabled`, `hoverPreview` control
- **Range**: `min`/`max` props (defaults 0-5)
- **Forms**: `name` and `required` props for form submission
- **RTL**: Automatic support with reversed navigation
- **Keyboard**: Number input, arrow keys, Home/End navigation
- **Accessibility**: Slider pattern with full ARIA support, customizable `aria-valuetext`