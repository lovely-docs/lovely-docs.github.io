# Dialog Component

Modal window using compound components: `Root`, `Trigger`, `Portal`, `Overlay`, `Content`, `Title`, `Description`, `Close`.

**State:** `bind:open` for two-way binding or function binding for full control.

**Focus:** Focus trap (default), customizable open/close focus with `onOpenAutoFocus`/`onCloseAutoFocus`.

**Behaviors:** Scroll lock (default), escape key handling (`escapeKeydownBehavior`, `onEscapeKeydown`), outside interaction (`interactOutsideBehavior`, `onInteractOutside`).

**Nesting:** Use `--bits-dialog-nested-count` CSS variable and `data-nested` attribute for styling nested dialogs.

**Transitions:** Use `forceMount` with `child` snippet for Svelte transitions.

**Reusable:** Create wrapper components accepting snippets for title/description.

**Forms:** Close after async with `open = false` or disable Portal if dialog is inside form.