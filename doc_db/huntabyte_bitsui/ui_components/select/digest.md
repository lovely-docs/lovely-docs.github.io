## Select Component

A dropdown component for selecting from a list of options with support for single or multiple selection.

### Key Features
- **Typeahead Search**: Type to quickly find options
- **Keyboard Navigation**: Arrow keys, Enter to select, full accessibility
- **Grouped Options**: Organize options into logical groups
- **Scroll Management**: Built-in scroll up/down buttons for long lists
- **Portal Support**: Render content in a portal to avoid layout issues
- **Accessibility**: ARIA attributes and screen reader support

### Architecture
- **Root**: Main container managing state and context
- **Trigger**: Button that opens the dropdown
- **Portal**: Renders dropdown content to body or custom target
- **Content**: Dropdown container using Floating UI for positioning
- **ContentStatic**: Alternative without Floating UI for manual positioning
- **Viewport**: Visible area determining size and scroll behavior
- **ScrollUpButton/ScrollDownButton**: Scroll controls for long lists
- **Item**: Individual selectable item
- **Group/GroupHeading**: Organize items into groups
- **Arrow**: Optional pointer to trigger

### State Management

**Two-way binding:**
```svelte
<script>
  let value = $state("");
</script>
<Select.Root type="single" bind:value>
  <!-- ... -->
</Select.Root>
```

**Fully controlled with function binding:**
```svelte
<Select.Root bind:value={getValue, setValue}>
  <!-- ... -->
</Select.Root>
```

**Open state:**
```svelte
<Select.Root bind:open={myOpen}>
  <!-- ... -->
</Select.Root>
```

### Multiple Selection
Set `type="multiple"` to allow multiple items. Value becomes an array of strings.

```svelte
<script>
  let value = $state<string[]>([]);
</script>
<Select.Root type="multiple" bind:value>
  <!-- ... -->
</Select.Root>
```

### Positioning
- **Default**: Uses Floating UI via `Select.Content` with `side`, `sideOffset`, `align`, `alignOffset` props
- **Static**: Use `Select.ContentStatic` to opt-out of Floating UI and position manually
- **Custom Anchor**: Pass `customAnchor` prop to anchor content to different element

### Scroll Behavior
- Use `Select.Viewport` to track scroll position
- Scroll buttons render automatically when content exceeds viewport
- Control scroll delay with `delay` prop on scroll buttons (receives tick number, returns milliseconds)
- Alternatively omit scroll buttons and use native scrollbar with height/overflow on `Select.Content`
- Set `preventScroll={true}` on content to disable body scrolling when open

### Highlighting & Selection
- Follows WAI-ARIA descendant pattern: trigger retains focus while items highlight on navigation
- Use `data-highlighted` attribute to style highlighted items
- `onHighlight` and `onUnhighlight` callbacks available on items

### Animations
Use `forceMount` prop with `child` snippet to enable Svelte transitions:

```svelte
<Select.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Select.Content>
```

### Reusable Component Pattern
Create a wrapper component to avoid repeating structure:

```svelte
<script>
  import { Select, type WithoutChildren } from "bits-ui";
  
  type Props = WithoutChildren<Select.RootProps> & {
    placeholder?: string;
    items: { value: string; label: string; disabled?: boolean }[];
  };
  
  let { value = $bindable(), items, placeholder, ...restProps } = $props();
</script>

<Select.Root bind:value={value as never} {...restProps}>
  <Select.Trigger>
    {items.find(i => i.value === value)?.label ?? placeholder}
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.ScrollUpButton>up</Select.ScrollUpButton>
      <Select.Viewport>
        {#each items as { value, label, disabled }}
          <Select.Item {value} {label} {disabled}>
            {#snippet children({ selected })}
              {selected ? "✅" : ""} {label}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
      <Select.ScrollDownButton>down</Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### Form Integration
Pass `name` prop to Root to render hidden input for form submission. Use `required` prop for validation.