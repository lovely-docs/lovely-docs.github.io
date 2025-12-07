## Popover

Floating panel anchored to trigger element.

**Basic structure:**
```svelte
<Popover.Root>
  <Popover.Trigger />
  <Popover.Portal>
    <Popover.Content>
      <Popover.Close />
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

**State:** `bind:open={isOpen}` or fully controlled with function binding.

**Focus:** `trapFocus` (default true), `onOpenAutoFocus`, `onCloseAutoFocus` callbacks.

**Positioning:** `side` ('top'|'bottom'|'left'|'right'), `sideOffset`, `align` ('start'|'center'|'end'), `alignOffset`, `avoidCollisions` (default true), `sticky` ('partial'|'always').

**Behavior:** `preventScroll`, `escapeKeydownBehavior` ('close'|'ignore'), `interactOutsideBehavior` ('close'|'ignore'), `customAnchor` for alternate anchor element.

**Animations:** Use `forceMount` with `child` snippet for Svelte transitions.

**Optional:** `Popover.Overlay` for background overlay, `Popover.ContentStatic` for non-floating variant.