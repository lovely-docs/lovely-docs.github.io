## Alert Dialog

Modal component for confirmations and user input without navigation.

**Basic structure**: Root → Trigger, Portal → (Overlay + Content with Title/Description/Cancel/Action)

**State**: `bind:open` for two-way binding or function bindings for full control

**Focus**: Trapped by default; customize with `onOpenAutoFocus`/`onCloseAutoFocus`

**Behaviors**: 
- Scroll lock enabled by default (`preventScroll={false}` to disable)
- Escape key closes by default (`escapeKeydownBehavior="ignore"` to prevent)
- Outside clicks ignored by default (`interactOutsideBehavior="close"` to close)

**Nesting**: Use `data-nested`, `data-nested-open`, `--bits-dialog-depth`, `--bits-dialog-nested-count` for styling

**Forms**: Action button doesn't auto-close; programmatically close after async work. Keep Portal inside form to avoid submission issues.