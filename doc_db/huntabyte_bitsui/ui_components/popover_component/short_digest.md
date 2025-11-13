## Popover Component

Floating panel anchored to trigger element.

**State**: `bind:open={isOpen}` or fully controlled with function bindings

**Focus**: Trap enabled by default; customize with `onOpenAutoFocus`/`onCloseAutoFocus`

**Interactions**: 
- Escape closes by default → `escapeKeydownBehavior="ignore"`
- Outside click closes → `interactOutsideBehavior="ignore"`
- Scroll locked with `preventScroll={true}`

**Positioning**: 
- `side` ('top'|'bottom'|'left'|'right'), `align` ('start'|'center'|'end')
- `sideOffset`, `alignOffset` for spacing
- `customAnchor` to anchor to different element
- Collision avoidance enabled by default

**Animations**: Use `forceMount` with child snippet for Svelte transitions

**Overlay**: Optional `Popover.Overlay` for backdrop