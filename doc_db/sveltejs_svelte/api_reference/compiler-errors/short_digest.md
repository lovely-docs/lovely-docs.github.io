## Compiler Errors

Complete reference of all Svelte compiler error codes organized by category:

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_contenteditable_missing`, `attribute_duplicate`, `attribute_empty_shorthand`, `attribute_invalid_event_handler`, `attribute_invalid_multiple`, `attribute_invalid_name`, `attribute_invalid_sequence_expression`, `attribute_invalid_type`, `attribute_unquoted_sequence`

**Bindings**: `bind_group_invalid_expression`, `bind_group_invalid_snippet_parameter`, `bind_invalid_expression`, `bind_invalid_name`, `bind_invalid_parens`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_continuation_placement`, `block_invalid_elseif`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_character`, `block_unexpected_close`

**Components**: `component_invalid_directive`, `svelte_component_invalid_this`, `svelte_component_missing_this`

**Const Tags**: `const_tag_cycle`, `const_tag_invalid_expression`, `const_tag_invalid_placement`, `const_tag_invalid_reference` - const declarations must be in specific block contexts and cannot reference variables from outer scopes

**CSS**: `:global` selector rules, nesting, declarations, selectors - cannot mix `:global` with scoped selectors in same list, cannot use in pseudoclasses, must be at start/end of sequence

**Declarations**: `declaration_duplicate`, `declaration_duplicate_module_import`, `duplicate_class_field`

**Each Blocks**: `each_item_invalid_assignment` (runes mode), `each_key_without_as` - cannot reassign each block argument in runes mode, use array index instead

**Elements**: `element_invalid_closing_tag`, `element_unclosed`, `node_invalid_placement` - browser HTML repair breaks Svelte assumptions (e.g., `<div>` inside `<p>` auto-closes `<p>`)

**Event Handlers**: `event_handler_invalid_component_modifier`, `event_handler_invalid_modifier`, `event_handler_invalid_modifier_combination`, `mixed_event_handler_syntaxes`

**Exports/Imports**: `export_undefined`, `module_illegal_default_export`, `import_svelte_internal_forbidden`, `runes_mode_invalid_import`

**Props**: `props_duplicate`, `props_id_invalid_placement`, `props_illegal_name`, `props_invalid_identifier`, `props_invalid_pattern`, `props_invalid_placement` - use `$props()` in runes mode

**Runes**: `rune_invalid_arguments`, `rune_invalid_arguments_length`, `rune_invalid_computed_property`, `rune_invalid_name`, `rune_invalid_spread`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_removed`, `rune_renamed`

**Scripts**: `script_duplicate`, `script_invalid_attribute_value`, `script_invalid_context`, `script_reserved_attribute`

**Slots**: `slot_attribute_duplicate`, `slot_attribute_invalid`, `slot_attribute_invalid_placement`, `slot_default_duplicate`, `slot_element_invalid_attribute`, `slot_element_invalid_name`, `slot_element_invalid_name_default`, `slot_snippet_conflict`

**Snippets**: `snippet_conflict`, `snippet_invalid_export`, `snippet_invalid_rest_parameter`, `snippet_parameter_assignment`, `snippet_shadowing_prop` - exported snippets only reference module-level script or other exportable snippets

**State**: `state_field_duplicate`, `state_field_invalid_assignment`, `state_invalid_placement` - state runes only as variable/class field initializer or first constructor assignment

**Stores**: `store_invalid_scoped_subscription`, `store_invalid_subscription`, `store_invalid_subscription_module` - store `$` prefix only in `.svelte` files

**Svelte Meta Tags**: `<svelte:body>`, `<svelte:boundary>`, `<svelte:fragment>`, `<svelte:head>`, `<svelte:options>`, `<svelte:self>`, `<title>` - specific attribute/content restrictions

**Transitions**: `transition_conflict`, `transition_duplicate`

**Legacy/Async**: `experimental_async`, `legacy_await_invalid`, `legacy_export_invalid`, `legacy_props_invalid`, `legacy_reactive_statement_invalid`, `legacy_rest_props_invalid` - runes mode replaces legacy patterns