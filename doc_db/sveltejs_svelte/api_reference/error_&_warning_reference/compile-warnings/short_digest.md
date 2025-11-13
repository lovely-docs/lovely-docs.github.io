## Accessibility (a11y_*)
Enforce accessible patterns: no `accesskey`, `autofocus`, or distracting elements; interactive elements need keyboard handlers and `tabindex`; labels need associated controls; media needs captions; ARIA attributes must match element roles and have correct types; no redundant roles.

## Attributes
- `attribute_avoid_is`: Don't use `is` attribute
- `attribute_illegal_colon`: No `:` in attributes
- `attribute_invalid_property_name`: Invalid HTML attributes
- `attribute_quoted`: Quoted component attributes will stringify

## Code Quality
- `bind_invalid_each_rest`: Rest operator breaks bindings in `{#each}`
- `component_name_lowercase`: Components need capital letters
- `css_unused_selector`: Remove unused selectors (use `:global` for `{@html}`)
- `element_implicitly_closed`: Add explicit closing tags
- `element_invalid_self_closing_tag`: Use `<div>...</div>` not `<div />`
- `event_directive_deprecated`: Use `on%name%` not `on:%name%`
- `legacy_component_creation`: Use `mount()`/`hydrate()` not class instantiation
- `non_reactive_update`: Use `$state()` for reactive variables
- `node_invalid_placement_ssr`: Invalid HTML structure breaks hydration
- `options_removed_*`: `enableSourcemap`, `hydratable`, `loopGuardTimeout` removed
- `options_renamed_ssr_dom`: `generate: "dom"` → `"client"`, `"ssr"` → `"server"`
- `perf_avoid_*_class`: Declare classes at top level
- `reactive_declaration_module_script_dependency`: Module reassignments don't trigger reactivity
- `script_context_deprecated`: Use `module` attribute
- `slot_element_deprecated`: Use `{@render}` instead
- `state_referenced_locally`: Wrap reassigned state in functions for lazy evaluation
- `store_rune_conflict`: Rename locals conflicting with `$` prefix
- `svelte_component_deprecated`: Components are dynamic by default
- `svelte_self_deprecated`: Use self-imports