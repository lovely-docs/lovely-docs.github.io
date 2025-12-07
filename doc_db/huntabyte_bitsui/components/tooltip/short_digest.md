## Tooltip Component

Displays supplementary information on hover/interaction. Requires `Tooltip.Provider` wrapper.

**Basic usage:**
```svelte
<Tooltip.Provider>
  <Tooltip.Root delayDuration={200}>
    <Tooltip.Trigger>Hover me</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content sideOffset={8}>
        <Tooltip.Arrow />
        Content
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

**State management:**
- Two-way binding: `bind:open={isOpen}`
- Fully controlled: `bind:open={() => myOpen, (v) => (myOpen = v)}`

**Key props:**
- `Tooltip.Root`: `delayDuration` (700ms), `disableCloseOnTriggerClick`, `disableHoverableContent`, `ignoreNonKeyboardFocus`
- `Tooltip.Content`: `side` (top|bottom|left|right), `sideOffset`, `align`, `customAnchor`, `forceMount` (for transitions)
- `Tooltip.ContentStatic`: No Floating UI positioning (manual positioning)

**Important:** Not supported on mobile (no hover). Use Popover for interactive content. Tooltip content should be non-essential.

**Reusable component pattern:** Wrap primitives in custom component accepting `trigger` and `children` snippets.

**Transitions:** Use `forceMount` with child snippet and Svelte transitions.

**Custom anchor:** Pass element to `customAnchor` prop to anchor content elsewhere.