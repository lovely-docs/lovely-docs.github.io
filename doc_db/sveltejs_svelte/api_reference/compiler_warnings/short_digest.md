## Disabling Warnings

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />

<!-- Multiple rules with explanation -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (reason) -->
<div onclick>...</div>
```

## Key Accessibility Warnings

- **a11y_click_events_have_key_events**: Non-interactive elements with `onclick` need `onkeyup`/`onkeydown` + `tabindex`
- **a11y_img_redundant_alt**: Alt text shouldn't say "image", "picture", or "photo"
- **a11y_missing_attribute**: `<a>` needs `href`, `<img>` needs `alt`, `<html>` needs `lang`, `<iframe>` needs `title`
- **a11y_no_static_element_interactions**: `<div>` with event handlers needs ARIA role
- **a11y_no_noninteractive_element_interactions**: Non-interactive elements can't have event listeners
- **a11y_positive_tabindex**: Avoid `tabindex > 0` (breaks tab order)

## Key Code Quality Warnings

- **non_reactive_update**: Variables reassigned without `$state()` won't trigger updates
- **state_referenced_locally**: Reassigned state loses reactivity; wrap in function for lazy evaluation
- **element_invalid_self_closing_tag**: Non-void elements need explicit closing tags, not `<div />`
- **css_unused_selector**: Use `:global` to preserve intentional selectors
- **legacy_component_creation**: Use `mount` or `hydrate` instead of component classes
- **slot_element_deprecated**: Use `{@render ...}` instead of `<slot>`