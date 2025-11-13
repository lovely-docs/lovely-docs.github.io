## Overview
Displays supplementary information when users hover over or interact with an element.

## Structure
```svelte
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger />
    <Tooltip.Portal>
      <Tooltip.Content>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Provider Component
`Tooltip.Provider` is required as an ancestor of `Tooltip.Root`. It provides shared state and ensures only one tooltip is open at a time. Set `delayDuration` or `disableHoverableContent` on the provider to apply to all tooltips within it. Recommended to wrap root layout content:

```svelte
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
```

## State Management
Use `bind:open` for two-way binding or function bindings for complete control:
```svelte
<Tooltip.Root bind:open={isOpen}>
  <!-- ... -->
</Tooltip.Root>
```

## Mobile Tooltips
Tooltips are not supported on mobile devices since there is no hover state. Use Popover instead for mobile-friendly alternatives.

## Reusable Components
Create custom tooltip components by composing primitives:
```svelte
<Tooltip.Root bind:open {...restProps}>
  <Tooltip.Trigger {...triggerProps}>
    {@render trigger()}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>
      <Tooltip.Arrow />
      {@render children?.()}
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
```

## Configuration Options
- `delayDuration`: Milliseconds to delay opening (default: 700)
- `disableCloseOnTriggerClick`: Prevent closing on trigger click
- `disableHoverableContent`: Close when moving mouse toward content
- `ignoreNonKeyboardFocus`: Prevent opening on non-keyboard focus

## Svelte Transitions
Use `forceMount` with child snippet to enable Svelte transitions:
```svelte
<Tooltip.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Tooltip.Content>
```

## Floating UI
By default uses Floating UI for positioning. Opt-out with `Tooltip.ContentStatic` for manual positioning. When using `ContentStatic`, `Tooltip.Arrow` won't render relative to it.

## Custom Anchor
Anchor content to a different element using `customAnchor` prop:
```svelte
<Tooltip.Content customAnchor={customAnchorElement}>
  <!-- content -->
</Tooltip.Content>
```

## API Reference
**Tooltip.Provider**: `delayDuration`, `disableHoverableContent`, `disabled`, `disableCloseOnTriggerClick`, `skipDelayDuration`, `ignoreNonKeyboardFocus`

**Tooltip.Root**: `open` (bindable), `onOpenChange`, `onOpenChangeComplete`, `disabled`, `delayDuration`, `disableHoverableContent`, `disableCloseOnTriggerClick`, `ignoreNonKeyboardFocus`

**Tooltip.Trigger**: `disabled`, `ref` (bindable), data attributes: `data-state`, `data-tooltip-trigger`

**Tooltip.Content**: Floating UI positioning props (`side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, `collisionBoundary`, `sticky`, `hideWhenDetached`, `updatePositionStrategy`, `strategy`), interaction props (`onInteractOutside`, `onFocusOutside`, `interactOutsideBehavior`, `onEscapeKeydown`, `escapeKeydownBehavior`), `forceMount`, `customAnchor`, `dir`, CSS variables for transform origin and dimensions

**Tooltip.ContentStatic**: Similar to Content but without Floating UI positioning

**Tooltip.Arrow**: `width` (default: 8), `height` (default: 8), data attributes: `data-arrow`, `data-tooltip-arrow`, `data-side`

**Tooltip.Portal**: `to` (where to render), `disabled`