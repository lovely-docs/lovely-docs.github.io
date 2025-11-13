## RatingGroup Component

A customizable rating component that enables users to provide ratings using configurable items (typically stars).

### Basic Usage
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

### State Management
- **Two-way binding**: `bind:value` for automatic synchronization
- **Fully controlled**: Use function bindings with `bind:value={getValue, setValue}` for custom logic
- **Form integration**: Set `name` prop to render hidden input for form submission; use `required` prop for validation

### Features
- **Half ratings**: Enable with `allowHalf` prop for 3.5-star ratings
- **Readonly mode**: Set `readonly={true}` to display ratings without interaction
- **Disabled state**: Set `disabled={true}` to prevent interaction
- **Hover preview**: Enabled by default; disable with `hoverPreview={false}`
- **RTL support**: Automatically adapts to `dir="rtl"` with reversed arrow key navigation
- **Min/max values**: Control range with `min` and `max` props (defaults: 0 and 5)

### Keyboard Navigation
- **Number input**: Type exact rating (e.g., `3` or `2.5` with `allowHalf`)
- **Arrow keys**: Increment/decrement by 1 (or 0.5 with `allowHalf`)
- **Home/End**: Jump to min/max values
- **PageUp/PageDown**: Alternative increment/decrement

### Accessibility
- Uses slider pattern (`role="slider"`) for better screen reader support
- Includes `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes
- Customizable `aria-valuetext` for contextual descriptions
- Single tab stop with intelligent focus management

### API
**RatingGroup.Root props**: `value`, `onValueChange`, `disabled`, `required`, `name`, `min`, `max`, `allowHalf`, `readonly`, `orientation`, `hoverPreview`, `aria-valuetext`, `ref`, `children`/`child` snippet

**RatingGroup.Item props**: `index` (required), `disabled`, `ref`, `children`/`child` snippet

**Data attributes**: `data-orientation`, `data-disabled`, `data-readonly`, `data-state`, `data-value`