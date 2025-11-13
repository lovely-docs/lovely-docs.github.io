## Dialog Component

Accessible modal dialog with compound component pattern (Root, Trigger, Portal, Overlay, Content, Title, Description, Close).

### State Management
```svelte
<Dialog.Root bind:open={isOpen}>
```

### Focus Management
```svelte
<Dialog.Content
  onOpenAutoFocus={(e) => { e.preventDefault(); input?.focus(); }}
  onCloseAutoFocus={(e) => { e.preventDefault(); input?.focus(); }}
  trapFocus={true}
>
```

### Advanced Behaviors
- Escape key: `escapeKeydownBehavior` ('close'|'ignore'|'defer-otherwise-close'|'defer-otherwise-ignore') or `onEscapeKeydown`
- Outside interaction: `interactOutsideBehavior` or `onInteractOutside`
- Scroll lock: `preventScroll={true}` (default)

### Nested Dialogs
CSS variables: `--bits-dialog-depth`, `--bits-dialog-nested-count`
Data attributes: `data-nested`, `data-nested-open`

### Transitions
```svelte
<Dialog.Overlay forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade></div>
    {/if}
  {/snippet}
</Dialog.Overlay>
```

### Form Submission
```svelte
<form onsubmit={() => wait(1000).then(() => (open = false))}>
```

### Reusable Component
Accept `buttonText`, `title`, `description` snippets and `contentProps` for customization.