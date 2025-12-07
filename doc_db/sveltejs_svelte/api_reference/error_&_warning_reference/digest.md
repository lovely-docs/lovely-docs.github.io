## Complete Error and Warning Reference for Svelte

Comprehensive documentation of all runtime errors, compiler errors, compiler warnings, and server-side errors in Svelte 5.

### Client-side Runtime Errors

**Reactivity Errors**: `async_derived_orphan` (async deriveds need effects), `derived_references_self`, `effect_in_unowned_derived`, `effect_orphan`, `effect_in_teardown`, `effect_pending_outside_reaction`, `effect_update_depth_exceeded` (infinite loops from reading/writing same state - use `untrack()` or regular variables), `state_unsafe_mutation` (cannot mutate state in derived/inspect/templates - make everything derived or use effects).

**Binding Errors**: `bind_invalid_checkbox_value` (use `bind:checked`), `bind_invalid_export` (use `bind:this`), `bind_not_bindable` (mark with `$bindable()`), `props_invalid_value` (cannot bind undefined when fallback exists), `props_rest_readonly`.

**Component Errors**: `component_api_changed` (methods no longer valid in Svelte 5), `component_api_invalid_new` (cannot use `new` on components).

**Loop Errors**: `each_key_duplicate`.

**Context & Lifecycle**: `set_context_after_init` (must call during initialization), `lifecycle_legacy_only`.

**State Errors**: `state_descriptors_fixed`, `state_prototype_fixed`.

**Async/Fork Errors**: `experimental_async_fork`, `fork_discarded`, `fork_timing`, `flush_sync_in_effect`.

**Other**: `get_abort_signal_outside_reaction`, `hydration_failed`, `invalid_snippet` (use optional chaining), `rune_outside_svelte`, `svelte_boundary_reset_onerror` (wait with `await tick()` before calling reset).

### Client-side Warnings

**State & Reactivity**: `assignment_value_stale` (separate statements), `await_reactivity_loss` (pass values as parameters), `await_waterfall` (create promises first), `console_log_state` (use `$inspect()` or `$state.snapshot()`), `legacy_recursive_reactive_block`, `non_reactive_update` (use `$state()` for updates), `state_proxy_equality_mismatch` (compare values consistently), `state_referenced_locally` (wrap in function for lazy evaluation).

**Binding & Props**: `binding_property_non_reactive`, `ownership_invalid_binding` (use `bind:` in parent), `ownership_invalid_mutation` (use `bind:` or `$bindable()`), `state_proxy_unmount` (use `$state.raw()`).

**Hydration**: `hydration_attribute_changed` (ensure server/client match or force update in effect), `hydration_html_changed` (same pattern as attribute_changed), `hydration_mismatch` (server HTML structure differs).

**Events & Lifecycle**: `event_handler_invalid`, `lifecycle_double_unmount`.

**Snippets & Rendering**: `invalid_raw_snippet_render` (must return single element), `svelte_boundary_reset_noop` (only works first time).

**Other**: `select_multiple_invalid_value` (must be array/null/undefined), `transition_slide_display` (doesn't work with inline/table/contents).

### Compiler Errors (200+)

**Animations**: `animation_duplicate`, `animation_invalid_placement` (only child of keyed each), `animation_missing_key`.

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_contenteditable_missing`, `attribute_duplicate`, `attribute_empty_shorthand`, `attribute_invalid_event_handler`, `attribute_invalid_multiple`, `attribute_invalid_type`, `attribute_invalid_sequence_expression` (wrap in parens in runes mode), `attribute_unquoted_sequence`.

**Bindings**: `bind_group_invalid_expression`, `bind_group_invalid_snippet_parameter`, `bind_invalid_expression`, `bind_invalid_name`, `bind_invalid_parens`, `bind_invalid_target`, `bind_invalid_value`.

**Blocks**: `block_duplicate_clause`, `block_invalid_continuation_placement`, `block_invalid_elseif` (use `else if`), `block_invalid_placement`, `block_unclosed`, `block_unexpected_character`, `block_unexpected_close`.

**Const Tags**: `const_tag_cycle`, `const_tag_invalid_expression`, `const_tag_invalid_placement` (must be immediate child of snippet/if/else/each/then/catch/fragment/boundary/component), `const_tag_invalid_reference` (scoping issue - const in boundary not available in nested snippet).

**CSS**: `css_empty_declaration`, `css_expected_identifier`, `css_global_block_invalid_combinator`, `css_global_block_invalid_declaration`, `css_global_block_invalid_list` (cannot mix `:global` with non-global in selector list), `css_global_block_invalid_modifier`, `css_global_block_invalid_modifier_start`, `css_global_block_invalid_placement`, `css_global_invalid_placement`, `css_global_invalid_selector`, `css_global_invalid_selector_list`, `css_nesting_selector_invalid_placement`, `css_selector_invalid`, `css_type_selector_invalid_placement`.

**Declarations**: `declaration_duplicate`, `declaration_duplicate_module_import`, `constant_assignment`, `constant_binding`.

**Each Blocks**: `each_item_invalid_assignment` (cannot reassign each argument in runes mode - use index instead: `{#each array as entry, i}` then `array[i] = value`), `each_key_without_as`.

**Elements**: `element_invalid_closing_tag`, `element_invalid_closing_tag_autoclosed`, `element_unclosed`.

**Event Handlers**: `event_handler_invalid_component_modifier` (only `once` on components), `event_handler_invalid_modifier`, `event_handler_invalid_modifier_combination`.

**Exports**: `export_undefined`, `export_let_unused`, `derived_invalid_export` (export function instead).

**Experimental**: `experimental_async` (need `experimental.async` compiler option for await in deriveds/templates/top-level).

**Global**: `global_reference_invalid` (use `globalThis.%name%`).

**Host**: `host_invalid_placement` (`$host()` only in custom element instances).

**Imports**: `import_svelte_internal_forbidden`.

**Inspect**: `inspect_trace_generator`, `inspect_trace_invalid_placement` (must be first statement).

**Invalid/Parse**: `invalid_arguments_usage`, `js_parse_error`.

**Legacy**: `legacy_await_invalid`, `legacy_export_invalid` (use `$props()`), `legacy_props_invalid` (use `$props()`), `legacy_reactive_statement_invalid` (use `$derived`/`$effect`), `legacy_rest_props_invalid`.

**Misc**: `mixed_event_handler_syntaxes`, `module_illegal_default_export`, `node_invalid_placement` (HTML repair breaks Svelte - examples: `<p><div></div></p>` becomes `<p></p><div></div><p></p>`, `<option><div></div></option>` becomes `<option></option>`, `<table><tr><td></td></tr></table>` becomes `<table><tbody><tr><td></td></tr></tbody></table>`).

**Options**: `options_invalid_value`, `options_removed`, `options_unrecognised`.

**Props**: `props_duplicate` (cannot use `$props()` twice), `props_id_invalid_placement` (only at top level), `props_illegal_name` (cannot start with `$$`), `props_invalid_identifier` (only object destructuring), `props_invalid_pattern` (no nested properties/computed keys), `props_invalid_placement`.

**Runes**: `rune_invalid_arguments`, `rune_invalid_arguments_length`, `rune_invalid_computed_property`, `rune_invalid_name`, `rune_invalid_spread`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_removed`, `rune_renamed`.

**Scripts**: `script_duplicate`, `script_invalid_attribute_value`, `script_invalid_context`, `script_reserved_attribute`, `bindable_invalid_location` (`$bindable()` only in `$props()`).

**Slots**: `slot_attribute_duplicate`, `slot_attribute_invalid`, `slot_attribute_invalid_placement`, `slot_default_duplicate`, `slot_element_invalid_attribute`, `slot_element_invalid_name`, `slot_element_invalid_name_default`, `slot_snippet_conflict`.

**Snippets**: `snippet_conflict` (cannot use `<slot>` and `{@render}` together), `snippet_invalid_export` (only references module-level script or other exportable snippets), `snippet_invalid_rest_parameter` (use array), `snippet_parameter_assignment`, `snippet_shadowing_prop`.

**State**: `state_field_duplicate`, `state_field_invalid_assignment`, `state_invalid_export` (export function or only mutate properties), `state_invalid_placement` (only as variable/class field/constructor assignment).

**Stores**: `store_invalid_scoped_subscription`, `store_invalid_subscription`, `store_invalid_subscription_module`.

**Styles**: `style_directive_invalid_modifier` (only `important`), `style_duplicate`.

**Svelte Elements**: `svelte_body_illegal_attribute`, `svelte_boundary_invalid_attribute`, `svelte_boundary_invalid_attribute_value`, `svelte_component_invalid_this`, `svelte_component_missing_this`, `svelte_element_missing_this`, `svelte_fragment_invalid_attribute`, `svelte_fragment_invalid_placement`, `svelte_head_illegal_attribute`, `svelte_meta_duplicate`, `svelte_meta_invalid_content`, `svelte_meta_invalid_placement`, `svelte_meta_invalid_tag`, `svelte_options_deprecated_tag`, `svelte_options_invalid_attribute`, `svelte_options_invalid_attribute_value`, `svelte_options_invalid_customelement`, `svelte_options_invalid_customelement_props`, `svelte_options_invalid_customelement_shadow`, `svelte_options_invalid_tagname`, `svelte_options_reserved_tagname`, `svelte_options_unknown_attribute`, `svelte_self_invalid_placement` (only in if/each/snippet blocks or slots).

**Tags**: `tag_invalid_name`, `tag_invalid_placement`, `textarea_invalid_content`, `title_illegal_attribute`, `title_invalid_content`.

**Transitions**: `transition_conflict`, `transition_duplicate`.

**TypeScript**: `typescript_invalid_feature` (use preprocessor).

**Misc**: `unexpected_eof`, `unexpected_reserved_word`, `unterminated_string_constant`, `void_element_invalid_content`.

### Compiler Warnings (100+)

**Accessibility (a11y_*)**: `accesskey`, `aria_activedescendant_has_tabindex`, `aria_attributes` (reserved elements), `autofocus`, `click_events_have_key_events` (need keyboard handlers), `consider_explicit_label`, `distracting_elements`, `figcaption_index`, `figcaption_parent`, `hidden` (certain elements), `img_redundant_alt`, `incorrect_aria_attribute_type` (aria-hidden: boolean, aria-activedescendant: ID, aria-labelledby: ID list, aria-level: integer, aria-sort: token, aria-pressed: tristate), `interactive_supports_focus`, `invalid_attribute` (href), `label_has_associated_control`, `media_has_caption`, `misplaced_role`, `misplaced_scope`, `missing_attribute` (a: href, area: alt/aria-label/aria-labelledby, html: lang, iframe: title, img: alt, object: title/aria-label/aria-labelledby, input[type=image]: alt/aria-label/aria-labelledby), `missing_content`, `mouse_events_have_key_events`, `no_abstract_role`, `no_interactive_element_to_noninteractive_role`, `no_noninteractive_element_interactions`, `no_noninteractive_element_to_interactive_role`, `no_noninteractive_tabindex`, `no_redundant_roles`, `no_static_element_interactions`, `positive_tabindex`, `role_has_required_aria_props`, `role_supports_aria_props`, `unknown_aria_attribute`, `unknown_role`.

**Attributes**: `attribute_avoid_is`, `attribute_global_event_reference`, `attribute_illegal_colon`, `attribute_invalid_property_name`, `attribute_quoted`.

**Code Quality**: `bidirectional_control_characters`, `bind_invalid_each_rest`, `block_empty`, `component_name_lowercase`, `css_unused_selector` (use `:global()` for selectors targeting `{@html}` or child components), `custom_element_props_identifier`, `element_implicitly_closed`, `element_invalid_self_closing_tag`, `event_directive_deprecated` (use `on%name%`), `export_let_unused`, `legacy_code`, `legacy_component_creation`, `node_invalid_placement_ssr`, `options_deprecated_accessors`, `options_deprecated_immutable`, `options_missing_custom_element`, `options_removed_enable_sourcemap`, `options_removed_hydratable`, `options_removed_loop_guard_timeout`, `options_renamed_ssr_dom`, `perf_avoid_inline_class`, `perf_avoid_nested_class`, `reactive_declaration_invalid_placement`, `reactive_declaration_module_script_dependency`, `script_context_deprecated` (use `module` attribute), `script_unknown_attribute`, `slot_element_deprecated` (use `{@render}`), `store_rune_conflict`, `svelte_component_deprecated` (use dynamic components), `svelte_element_invalid_this`, `svelte_self_deprecated`, `unknown_code`.

### Server-side Errors

**await_invalid**: Async work in sync render - await result or wrap in `<svelte:boundary>`.

**html_deprecated**: Use `body` instead of `html` property.

**lifecycle_function_unavailable**: Methods like `mount` unavailable on server.

### Shared Errors

**invalid_default_snippet**: Cannot use `{@render children(...)}` with `let:` directives - use named snippets.

**invalid_snippet_arguments**: Snippets only instantiated via `{@render}`.

**lifecycle_outside_component**: Lifecycle methods only at top level of instance script.

**missing_context**: Context not set in parent - `get` throws if `set` not called.

**snippet_without_render_tag**: Snippet stringified instead of rendered - use `{@render}`.

**store_invalid_shape**: Not a store with `subscribe` method.

**svelte_element_invalid_this_value**: `this` prop must be string.

### Shared Warnings

**dynamic_void_element_content**: Void elements ignore children.

**state_snapshot_uncloneable**: `$state.snapshot()` returns original for uncloneable values (DOM elements, etc.).