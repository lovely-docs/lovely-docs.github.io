## LinkPreview Component

A component that displays a summarized preview of linked content on hover/focus without navigating away. Only works with mouse/pointing devices; on touch devices the link is followed immediately.

### Structure
```svelte
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content />
</LinkPreview.Root>
```

### State Management

**Two-way binding:**
```svelte
<script lang="ts">
  let isOpen = $state(false);
</script>
<LinkPreview.Root bind:open={isOpen}>
```

**Fully controlled with function binding:**
```svelte
<script lang="ts">
  let myOpen = $state(false);
  function getOpen() { return myOpen; }
  function setOpen(newOpen: boolean) { myOpen = newOpen; }
</script>
<LinkPreview.Root bind:open={getOpen, setOpen}>
```

### Positioning

Use `LinkPreview.Content` with Floating UI for automatic positioning, or `LinkPreview.ContentStatic` for manual positioning. Anchor to a different element via `customAnchor` prop (accepts selector string or HTMLElement).

### Animations

Use `forceMount` prop with the `child` snippet to enable Svelte transitions:
```svelte
<LinkPreview.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</LinkPreview.Content>
```

### Key Props

**LinkPreview.Root:** `open`, `onOpenChange`, `onOpenChangeComplete`, `openDelay` (700ms), `closeDelay` (300ms), `disabled`, `ignoreNonKeyboardFocus`

**LinkPreview.Content:** `side` ('bottom'), `sideOffset`, `align` ('start'), `alignOffset`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`, `sticky`, `hideWhenDetached`, `updatePositionStrategy`, `strategy` ('fixed'), `preventScroll`, `customAnchor`, `trapFocus`, `forceMount`

**LinkPreview.Arrow:** `width` (8px), `height` (8px)

**LinkPreview.Portal:** `to` (document.body), `disabled`