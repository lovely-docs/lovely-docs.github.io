## Dialog Component

A compound component for creating accessible modal dialogs with fine-grained control over structure and behavior.

### Key Features
- Compound component pattern with sub-components: Root, Trigger, Portal, Overlay, Content, Title, Description, Close
- WAI-ARIA compliant with keyboard navigation and screen reader support
- Customizable styling and configuration per sub-component
- Portal support for proper stacking context
- Automatic focus management with customization options
- Controlled and uncontrolled state support

### State Management

Two-way binding:
```svelte
<script lang="ts">
  let isOpen = $state(false);
</script>
<button onclick={() => (isOpen = true)}>Open</button>
<Dialog.Root bind:open={isOpen}>
  <!-- ... -->
</Dialog.Root>
```

Function binding for complete control:
```svelte
<Dialog.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Dialog.Root>
```

### Focus Management

Focus trap enabled by default (WAI-ARIA pattern). Customize initial focus:
```svelte
<Dialog.Content
  onOpenAutoFocus={(e) => {
    e.preventDefault();
    nameInput?.focus();
  }}
>
  <input type="text" bind:this={nameInput} />
</Dialog.Content>
```

Customize close focus:
```svelte
<Dialog.Content
  onCloseAutoFocus={(e) => {
    e.preventDefault();
    nameInput?.focus();
  }}
>
```

Disable focus trap (not recommended):
```svelte
<Dialog.Content trapFocus={false}>
```

### Advanced Behaviors

**Scroll Lock**: Disabled by default when dialog opens. Allow scrolling:
```svelte
<Dialog.Content preventScroll={false}>
```

**Escape Key Handling**: 
- `escapeKeydownBehavior`: 'close' (default), 'ignore', 'defer-otherwise-close', 'defer-otherwise-ignore'
- Custom handler: `onEscapeKeydown={(e) => { e.preventDefault(); /* custom logic */ }}`

**Outside Interaction**:
- `interactOutsideBehavior`: 'close' (default), 'ignore', 'defer-otherwise-close', 'defer-otherwise-ignore'
- Custom handler: `onInteractOutside={(e) => { e.preventDefault(); /* custom logic */ }}`

### Nested Dialogs

Dialogs can be nested. Use CSS variables and data attributes for styling:
- `--bits-dialog-depth`: Nesting depth (0 for root)
- `--bits-dialog-nested-count`: Number of open nested dialogs
- `data-nested`: Present on nested dialog content/overlay
- `data-nested-open`: Present when nested dialogs are open

Example with scale and blur:
```svelte
<Dialog.Content
  style="transform: scale(calc(1 - var(--bits-dialog-nested-count) * 0.05));
         filter: blur(calc(var(--bits-dialog-nested-count) * 2px));"
>
```

### Svelte Transitions

Use `forceMount` with `child` snippet for transitions:
```svelte
<Dialog.Overlay forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade>
        <!-- ... -->
      </div>
    {/if}
  {/snippet}
</Dialog.Overlay>
```

### Form Submission

Close dialog after async action:
```svelte
<form
  onsubmit={() => {
    wait(1000).then(() => (open = false));
  }}
>
```

When using Dialog within a form, disable Portal to keep content in form context.

### Reusable Component Pattern

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import { Dialog, type WithoutChild } from "bits-ui";
  
  type Props = Dialog.RootProps & {
    buttonText: string;
    title: Snippet;
    description: Snippet;
    contentProps?: WithoutChild<Dialog.ContentProps>;
  };
  
  let { open = $bindable(false), children, buttonText, contentProps, title, description, ...restProps }: Props = $props();
</script>

<Dialog.Root bind:open {...restProps}>
  <Dialog.Trigger>{buttonText}</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content {...contentProps}>
      <Dialog.Title>{@render title()}</Dialog.Title>
      <Dialog.Description>{@render description()}</Dialog.Description>
      {@render children?.()}
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### API Reference

**Dialog.Root**: Manages dialog state
- `open` (bindable): boolean, default false
- `onOpenChange`: callback when state changes
- `onOpenChangeComplete`: callback after animations complete

**Dialog.Trigger**: Opens dialog on press
- `ref` (bindable): HTMLButtonElement

**Dialog.Content**: Main dialog container
- `onEscapeKeydown`, `escapeKeydownBehavior`: Escape key handling
- `onInteractOutside`, `interactOutsideBehavior`: Outside interaction handling
- `onOpenAutoFocus`, `onCloseAutoFocus`: Focus management
- `trapFocus`: boolean, default true
- `forceMount`: boolean for transitions
- `preventScroll`: boolean, default true
- `restoreScrollDelay`: number for transition delays

**Dialog.Overlay**: Backdrop element
- `forceMount`: boolean for transitions

**Dialog.Title, Dialog.Description, Dialog.Close**: Semantic elements
- `ref` (bindable): HTMLDivElement/HTMLButtonElement

**Dialog.Portal**: Renders content outside DOM hierarchy
- `to`: Element or string selector, default document.body
- `disabled`: boolean, default false