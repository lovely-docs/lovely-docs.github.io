## LinkPreview Component

Displays a preview of linked content on hover/focus (mouse/pointing devices only). Uses Floating UI for positioning by default.

**Basic structure:**
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger href="..." />
  <LinkPreview.Content><!-- preview content --></LinkPreview.Content>
</LinkPreview.Root>
```

**State management:** `bind:open` for two-way binding or function binding for full control.

**Positioning:** `LinkPreview.Content` uses Floating UI; use `LinkPreview.ContentStatic` for manual positioning. Anchor to different element with `customAnchor` prop.

**Animations:** Use `forceMount` with `child` snippet for Svelte transitions.

**Key props:** `openDelay` (700ms), `closeDelay` (300ms), `side`, `sideOffset`, `align`, `trapFocus`, `preventScroll`