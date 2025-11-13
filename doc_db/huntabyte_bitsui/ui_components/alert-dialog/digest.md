## Alert Dialog Component

A modal component for presenting content or requesting user confirmation without navigating away from context.

### Structure
Built from sub-components: Root (state management), Trigger (opens dialog), Portal (renders outside DOM), Overlay (backdrop), Content (main content), Title, Description, Cancel (closes without action), Action (confirms action).

### Basic Usage
```svelte
<AlertDialog.Root>
  <AlertDialog.Trigger>Open Dialog</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm Action</AlertDialog.Title>
      <AlertDialog.Description>Are you sure?</AlertDialog.Description>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

### State Management
- **Two-way binding**: `bind:open={isOpen}` for automatic synchronization
- **Fully controlled**: Use function bindings with `bind:open={getOpen, setOpen}` for total control

### Focus Management
- Focus is trapped by default; disable with `trapFocus={false}`
- Override open focus with `onOpenAutoFocus` callback to focus specific elements
- Override close focus with `onCloseAutoFocus` callback to return focus elsewhere

### Advanced Behaviors

**Scroll Lock**: Body scrolling disabled by default. Allow with `preventScroll={false}`.

**Escape Key Handling**:
- `escapeKeydownBehavior`: Set to `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, or `'defer-otherwise-ignore'`
- `onEscapeKeydown` callback for custom logic

**Outside Interactions**:
- `interactOutsideBehavior`: Set to `'ignore'` (default), `'close'`, `'defer-otherwise-close'`, or `'defer-otherwise-ignore'`
- `onInteractOutside` callback for custom handling

### Nested Dialogs
Dialogs can nest within each other. Use data attributes and CSS variables for styling:
- `data-nested-open`: Present when nested dialogs are open
- `data-nested`: Present on nested dialog elements
- `--bits-dialog-depth`: Nesting depth (0 for root)
- `--bits-dialog-nested-count`: Number of open nested dialogs

### Form Submission
The Action button doesn't close the dialog by default. Programmatically close after async operations:
```svelte
<form onsubmit={() => {
  wait(1000).then(() => (open = false));
}}>
  <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
  <AlertDialog.Action type="submit">Submit</AlertDialog.Action>
</form>
```

When using AlertDialog within a form, disable the Portal or render it inside the form to prevent submission issues.

### Reusable Component Pattern
Create wrapper components with snippet props for title and description to maintain consistency across the application.