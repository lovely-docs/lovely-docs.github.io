**createAttachmentKey**: Creates a symbol key for programmatic attachment creation, alternative to `{@attach ...}` syntax.

**fromAction**: Converts actions to attachments. Usage: `{@attach fromAction(action, () => arg)}` instead of `use:action={arg}`.

**Attachment**: Function running on element mount, optionally returning cleanup function for unmount.