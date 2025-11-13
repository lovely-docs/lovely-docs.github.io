## Popover Component

A floating panel component anchored to a trigger element that displays rich content.

### Structure
```svelte
<Popover.Root>
  <Popover.Trigger />
  <Popover.Portal>
    <Popover.Overlay />
    <Popover.Content>
      <Popover.Close />
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
```

### State Management
- **Two-way binding**: `bind:open={isOpen}` for automatic synchronization
- **Fully controlled**: Use function bindings `bind:open={getOpen, setOpen}` for complete control

### Focus Management
- **Focus trap**: Enabled by default on `Popover.Content`, disable with `trapFocus={false}`
- **Open focus**: Automatically focuses first focusable element; override with `onOpenAutoFocus` callback
- **Close focus**: Automatically returns focus to trigger; override with `onCloseAutoFocus` callback

### Interaction Behavior
- **Scroll lock**: Set `preventScroll={true}` to lock body scroll when open
- **Escape key**: Closes by default; use `escapeKeydownBehavior="ignore"` or `onEscapeKeydown` to override
- **Outside interaction**: Closes on pointer down outside by default; use `interactOutsideBehavior="ignore"` or `onInteractOutside` to override

### Positioning
- **Anchor**: Anchored to trigger by default; use `customAnchor` prop to anchor to different element
- **Side**: `side` prop controls preferred position ('top' | 'bottom' | 'left' | 'right'), defaults to 'bottom'
- **Alignment**: `align` prop controls alignment ('start' | 'center' | 'end'), defaults to 'start'
- **Offsets**: `sideOffset` and `alignOffset` control distance from anchor
- **Collision avoidance**: `avoidCollisions={true}` by default; configure with `collisionBoundary` and `collisionPadding`

### Animations
Use `forceMount` with child snippet for Svelte transitions:
```svelte
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```

### Overlay
Optional `Popover.Overlay` component creates semi-transparent backdrop behind popover when open.

### CSS Variables
- `--bits-popover-content-transform-origin`: Transform origin of content
- `--bits-popover-content-available-width/height`: Available dimensions
- `--bits-popover-anchor-width/height`: Anchor element dimensions