Svelte compiler warnings for accessibility, attributes, and code issues. Disable with `<!-- svelte-ignore code -->` comments.

**Key accessibility warnings**: `a11y_autofocus`, `a11y_click_events_have_key_events` (non-interactive elements need keyboard handlers), `a11y_img_redundant_alt`, `a11y_label_has_associated_control`, `a11y_media_has_caption`, `a11y_missing_attribute`, `a11y_no_noninteractive_element_interactions`, `a11y_positive_tabindex`.

**Attribute warnings**: `attribute_illegal_colon`, `attribute_invalid_property_name`, `attribute_quoted`.

**Structural warnings**: `element_implicitly_closed`, `element_invalid_self_closing_tag`, `css_unused_selector` (use `:global()` to preserve).

**Reactivity warnings**: `non_reactive_update` (use `$state()`), `state_referenced_locally` (wrap in function for lazy evaluation).

**Deprecated**: `event_directive_deprecated` (use `on%name%` instead of `on:%name%`), `slot_element_deprecated` (use `{@render}`), `svelte_component_deprecated` (use `@const` or derived values), `svelte_self_deprecated` (use self-imports).

**Other**: `component_name_lowercase`, `legacy_component_creation` (use `mount`/`hydrate`), `node_invalid_placement_ssr` (HTML structure violations break hydration).