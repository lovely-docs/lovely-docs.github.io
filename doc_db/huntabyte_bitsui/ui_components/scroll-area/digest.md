## ScrollArea Component

A customizable scroll area component that provides consistent scrolling behavior across platforms.

### Structure
```svelte
<ScrollArea.Root>
  <ScrollArea.Viewport>
    <!-- Scrollable content -->
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

### Scroll Area Types
- **hover** (default): Shows scrollbars only when hovering and content exceeds viewport
- **scroll**: Displays scrollbars when scrolling (MacOS-like behavior)
- **auto**: Scrollbars appear and remain visible when content exceeds viewport
- **always**: Scrollbars always visible, even with smaller content

### Key Props
- `type`: 'hover' | 'scroll' | 'auto' | 'always' (default: 'hover')
- `scrollHideDelay`: Delay in ms before hiding scrollbars (default: 600)
- `dir`: 'ltr' | 'rtl' (default: 'ltr')
- `orientation` (on custom component): 'vertical' | 'horizontal' | 'both'

### Reusable Component Pattern
Create a wrapper component accepting `orientation` and `viewportClasses` props to reduce boilerplate when using ScrollArea throughout an application.

### Data Attributes
- `data-scroll-area-root`: Root element
- `data-scroll-area-viewport`: Viewport element
- `data-scroll-area-scrollbar-x/y`: Horizontal/vertical scrollbars
- `data-scroll-area-thumb-x/y`: Horizontal/vertical thumbs
- `data-scroll-area-corner`: Corner element
- `data-state`: 'visible' | 'hidden' on scrollbars and thumbs