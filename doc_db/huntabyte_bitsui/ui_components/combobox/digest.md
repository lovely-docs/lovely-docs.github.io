## Combobox Component

A searchable dropdown component combining input field with selectable options list.

### Key Features
- Keyboard navigation with full WAI-ARIA support
- Single or multiple selection modes
- Customizable filtering and rendering
- Portal support for complex layouts
- Floating UI positioning with collision detection

### Architecture
Sub-components: Root (state management), Input, Trigger, Portal, Content (with Floating UI), ContentStatic (manual positioning), Viewport (scroll tracking), ScrollUpButton, ScrollDownButton, Item, Group, GroupHeading, Arrow.

### State Management

**Value binding (single/multiple):**
```svelte
let myValue = $state("");
<Combobox.Root type="single" bind:value={myValue}>
```

**Open state:**
```svelte
let myOpen = $state(false);
<Combobox.Root bind:open={myOpen}>
```

### Positioning & Scrolling

Use `Combobox.Content` for automatic Floating UI positioning. Use `Combobox.ContentStatic` to opt-out and position manually.

Custom anchor: `<Combobox.Content customAnchor={element}>`

Scroll buttons require `Combobox.Viewport`. Custom scroll delay via `delay` prop accepting function: `delay={(tick) => calculateDelay(tick)}`

### Filtering Example
```svelte
let searchValue = $state("");
const filtered = $derived(
  searchValue === "" 
    ? items 
    : items.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()))
);
<Combobox.Input oninput={(e) => (searchValue = e.currentTarget.value)} />
{#each filtered as item}
  <Combobox.Item value={item.value} label={item.label} />
{/each}
```

### Styling
- Highlighted items: use `data-highlighted` attribute
- Item states: `data-selected`, `data-disabled` attributes
- Callbacks: `onHighlight`, `onUnhighlight` on items

### Advanced Features
- `preventScroll` prop prevents body scroll when open
- `forceMount` with `child` snippet for Svelte transitions
- `scrollAlignment` prop: 'nearest' or 'center'
- `allowDeselect` for single-select deselection
- `loop` for keyboard navigation wrapping
- Escape key behavior: `escapeKeydownBehavior` ('close', 'ignore', 'defer-otherwise-close', 'defer-otherwise-ignore')
- Outside interaction behavior: `interactOutsideBehavior` with same options

### Reusable Component Pattern
Create wrapper component accepting `items` array with `{value, label, disabled?}` structure, managing search state internally, exposing `type`, `value`, `open` as bindable props.