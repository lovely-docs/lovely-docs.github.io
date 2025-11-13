## Combobox

Searchable dropdown with single/multiple selection, keyboard navigation, and WAI-ARIA support.

**State:** `bind:value` (string or string[]), `bind:open` (boolean)

**Positioning:** `Combobox.Content` uses Floating UI; `Combobox.ContentStatic` for manual positioning. Custom anchor via `customAnchor` prop.

**Filtering:**
```svelte
let searchValue = $state("");
const filtered = $derived(items.filter(i => i.label.toLowerCase().includes(searchValue.toLowerCase())));
<Combobox.Input oninput={(e) => (searchValue = e.currentTarget.value)} />
{#each filtered as item}
  <Combobox.Item value={item.value} label={item.label} />
{/each}
```

**Scrolling:** Use `Combobox.Viewport` with `ScrollUpButton`/`ScrollDownButton`. Custom delay: `delay={(tick) => number}`

**Styling:** `data-highlighted`, `data-selected`, `data-disabled` attributes; `onHighlight`/`onUnhighlight` callbacks

**Options:** `preventScroll`, `forceMount` (for transitions), `scrollAlignment`, `allowDeselect`, `loop`, `escapeKeydownBehavior`, `interactOutsideBehavior`