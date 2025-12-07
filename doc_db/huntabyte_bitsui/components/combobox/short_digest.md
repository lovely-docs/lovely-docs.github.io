## Combobox Component

Input field with dropdown list for searching and selecting from options. Supports single/multiple selection.

### Basic Example
```svelte
<script>
  import { Combobox } from "bits-ui";
  const fruits = [
    { value: "mango", label: "Mango" },
    { value: "apple", label: "Apple" },
  ];
  let searchValue = $state("");
  const filtered = $derived(
    searchValue === ""
      ? fruits
      : fruits.filter((f) => f.label.toLowerCase().includes(searchValue.toLowerCase()))
  );
</script>

<Combobox.Root type="multiple" onOpenChangeComplete={(o) => { if (!o) searchValue = ""; }}>
  <Combobox.Input oninput={(e) => (searchValue = e.currentTarget.value)} placeholder="Search" />
  <Combobox.Trigger>Open</Combobox.Trigger>
  <Combobox.Portal>
    <Combobox.Content>
      <Combobox.Viewport>
        {#each filtered as fruit}
          <Combobox.Item value={fruit.value} label={fruit.label}>
            {#snippet children({ selected })}
              {fruit.label} {selected ? "✅" : ""}
            {/snippet}
          </Combobox.Item>
        {/each}
      </Combobox.Viewport>
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

### Key Features
- Keyboard navigation with ARIA support
- Single/multiple selection modes
- Floating UI positioning (or static with ContentStatic)
- Scroll buttons with customizable delay
- Item grouping support
- Highlighted items with `data-highlighted` attribute
- Svelte transitions via `forceMount` + `child` snippet

### State Management
- Value: `bind:value={myValue}` or `bind:value={getValue, setValue}`
- Open: `bind:open={myOpen}` or `bind:open={getOpen, setOpen}`

### Root Props
- `type` (required): 'single' | 'multiple'
- `value` ($bindable): string | string[]
- `open` ($bindable): boolean
- `disabled`, `required`, `name`, `loop`, `allowDeselect`, `scrollAlignment`
- `onValueChange`, `onOpenChange`, `onOpenChangeComplete`
- `items`: Array<{value, label, disabled?}>
- `inputValue`: read-only, syncs with selection

### Content Props (Floating UI)
- Positioning: `side`, `sideOffset`, `align`, `alignOffset`
- Collision: `avoidCollisions`, `collisionBoundary`, `collisionPadding`
- Behavior: `sticky`, `hideWhenDetached`, `updatePositionStrategy`, `strategy`
- Interaction: `preventScroll`, `onEscapeKeydown`, `escapeKeydownBehavior`, `onInteractOutside`, `interactOutsideBehavior`
- `customAnchor`: anchor to different element
- `forceMount`: for transitions

### ContentStatic Props (No Floating UI)
- `trapFocus`, `preventScroll`, `onOpenAutoFocus`, `onCloseAutoFocus`
- Same interaction props as Content

### Item Props
- `value` (required): string
- `label`: string
- `disabled`: boolean
- `onHighlight`, `onUnhighlight`: callbacks

### Scroll Buttons
- `delay`: (tick: number) => number function for scroll timing

### Other Components
- `Viewport`: tracks scroll for button rendering
- `Portal`: renders to body or custom target
- `Group`, `GroupHeading`: item grouping
- `Arrow`: pointer element