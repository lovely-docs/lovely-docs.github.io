## ScrollArea

Customizable scroll area with four types: **hover** (default, shows on hover), **scroll** (MacOS-like), **auto** (always visible when needed), **always** (always visible).

```svelte
<ScrollArea.Root type="hover" scrollHideDelay={600}>
  <ScrollArea.Viewport>Content</ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

Key props: `type`, `scrollHideDelay`, `dir`, `orientation`. Use data attributes like `data-state`, `data-scroll-area-scrollbar-x/y` for styling.