## LinkPreview Component

Displays a preview of linked content on hover/focus without navigation. Touch devices follow the link immediately; preview should not contain vital information.

### Basic Usage
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger href="...">
    <Avatar.Root>...</Avatar.Root>
  </LinkPreview.Trigger>
  <LinkPreview.Content sideOffset={8}>
    <!-- preview content -->
  </LinkPreview.Content>
</LinkPreview.Root>
```

### State Management
```svelte
<script>
  let isOpen = $state(false);
</script>
<LinkPreview.Root bind:open={isOpen}>...</LinkPreview.Root>
```

Or fully controlled:
```svelte
<LinkPreview.Root bind:open={getOpen, setOpen}>...</LinkPreview.Root>
```

### Key Features
- **Floating UI positioning** (default) or static positioning with `ContentStatic`
- **Custom anchor**: Use `customAnchor` prop to anchor to different element
- **Svelte transitions**: Use `forceMount` with `child` snippet for animations
- **Configurable delays**: `openDelay` (700ms default), `closeDelay` (300ms default)
- **Floating UI options**: `side`, `align`, `sideOffset`, `alignOffset`, `avoidCollisions`, `collisionPadding`, `sticky`, `hideWhenDetached`, `strategy`, `preventScroll`, etc.
- **Focus management**: `trapFocus`, `onOpenAutoFocus`, `onCloseAutoFocus`
- **Interaction handling**: `onInteractOutside`, `onEscapeKeydown` with behavior options
- **Portal support**: Render content to body or custom element
- **Arrow element**: Optional pointer with `LinkPreview.Arrow`
- **Data attributes**: `data-state`, `data-link-preview-trigger`, `data-link-preview-content`, `data-link-preview-arrow`
- **CSS variables**: Transform origin, available dimensions, anchor dimensions