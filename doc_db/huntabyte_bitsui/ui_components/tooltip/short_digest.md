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

## Key Features
- `Tooltip.Provider` required as ancestor; ensures only one tooltip open at a time
- State management: `bind:open` or function bindings
- Not supported on mobile (no hover state)
- Default delay: 700ms

## Configuration
- `delayDuration`: Delay before showing (default: 700ms)
- `disableCloseOnTriggerClick`: Keep open on click
- `disableHoverableContent`: Close when moving toward content
- `ignoreNonKeyboardFocus`: Ignore non-keyboard focus

## Advanced
- Use `forceMount` with child snippet for Svelte transitions
- `Tooltip.ContentStatic` for manual positioning (no Floating UI)
- `customAnchor` to anchor to different element
- `Tooltip.Portal` to render into body or custom element