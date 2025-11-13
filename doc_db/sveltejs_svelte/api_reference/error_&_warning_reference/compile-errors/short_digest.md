## Compile Errors Reference

Complete list of Svelte compiler error codes with descriptions.

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_contenteditable_missing`, `attribute_duplicate`, `attribute_empty_shorthand`, `attribute_invalid_event_handler`, `attribute_invalid_multiple`, `attribute_invalid_name`, `attribute_invalid_sequence_expression`, `attribute_invalid_type`, `attribute_unquoted_sequence`

**Bindings**: `bind_group_invalid_expression`, `bind_group_invalid_snippet_parameter`, `bind_invalid_expression`, `bind_invalid_name`, `bind_invalid_parens`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_continuation_placement`, `block_invalid_elseif`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_character`, `block_unexpected_close`

**Components**: `component_invalid_directive`

**Const Tags**: `const_tag_cycle`, `const_tag_invalid_expression`, `const_tag_invalid_placement`, `const_tag_invalid_reference`

Example - const not available in snippet:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error -->
    {/snippet}
</svelte:boundary>
```

**Declarations**: `declaration_duplicate`, `declaration_duplicate_module_import`, `constant_assignment`, `constant_binding`

**CSS**: `css_empty_declaration`, `css_expected_identifier`, `css_global_block_invalid_combinator`, `css_global_block_invalid_declaration`, `css_global_block_invalid_list`, `css_global_block_invalid_modifier`, `css_global_block_invalid_modifier_start`, `css_global_block_invalid_placement`, `css_global_invalid_placement`, `css_global_invalid_selector`, `css_global_invalid_selector_list`, `css_nesting_selector_invalid_placement`, `css_selector_invalid`, `css_type_selector_invalid_placement`

Invalid CSS: `:global, x { y { color: red; } }` - mixing global and scoped
Valid: Split into separate selectors

**Debug**: `debug_tag_invalid_arguments`

**Derived/Export**: `derived_invalid_export`, `state_invalid_export`

**Directives**: `directive_invalid_value`, `directive_missing_name`

**Dollar Prefix**: `dollar_binding_invalid`, `dollar_prefix_invalid`

**Each Blocks**: `each_item_invalid_assignment`, `each_key_without_as`

Legacy: `{#each array as entry} <button on:click={() => entry = 4}>`
Runes: `{#each array as entry, i} <button onclick={() => array[i] = 4}>`

**Effects**: `effect_invalid_placement`

**Elements**: `element_invalid_closing_tag`, `element_invalid_closing_tag_autoclosed`, `element_unclosed`, `void_element_invalid_content`

**Event Handlers**: `event_handler_invalid_component_modifier`, `event_handler_invalid_modifier`, `event_handler_invalid_modifier_combination`

**Exports**: `export_undefined`

**Global References**: `global_reference_invalid`

**Host**: `host_invalid_placement`

**Illegal Attributes**: `illegal_element_attribute`

**Imports**: `import_svelte_internal_forbidden`

**Inspect**: `inspect_trace_generator`, `inspect_trace_invalid_placement`

**Legacy Mode**: `legacy_await_invalid`, `legacy_export_invalid`, `legacy_props_invalid`, `legacy_reactive_statement_invalid`, `legacy_rest_props_invalid`

**Let Directives**: `let_directive_invalid_placement`

**Mixed Syntax**: `mixed_event_handler_syntaxes`

**Modules**: `module_illegal_default_export`

**Node Placement**: `node_invalid_placement` - browser repairs HTML breaking Svelte assumptions

Examples:
- `<p>hello <div>world</div></p>` → `<p>hello </p><div>world</div><p></p>`
- `<table><tr><td>cell</td></tr></table>` → `<table><tbody><tr><td>cell</td></tr></tbody></table>`

**Options**: `options_invalid_value`, `options_removed`, `options_unrecognised`

**Props**: `props_duplicate`, `props_id_invalid_placement`, `props_illegal_name`, `props_invalid_identifier`, `props_invalid_pattern`, `props_invalid_placement`

**Reactive**: `reactive_declaration_cycle`

**Render Tags**: `render_tag_invalid_call_expression`, `render_tag_invalid_expression`, `render_tag_invalid_spread_argument`

**Runes**: `rune_invalid_arguments`, `rune_invalid_arguments_length`, `rune_invalid_computed_property`, `rune_invalid_name`, `rune_invalid_spread`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_removed`, `rune_renamed`, `runes_mode_invalid_import`

**Scripts**: `script_duplicate`, `script_invalid_attribute_value`, `script_invalid_context`, `script_reserved_attribute`

**Slots**: `slot_attribute_duplicate`, `slot_attribute_invalid`, `slot_attribute_invalid_placement`, `slot_default_duplicate`, `slot_element_invalid_attribute`, `slot_element_invalid_name`, `slot_element_invalid_name_default`, `slot_snippet_conflict`

**Snippets**: `snippet_conflict`, `snippet_invalid_export`, `snippet_invalid_rest_parameter`, `snippet_parameter_assignment`, `snippet_shadowing_prop`

Invalid exported snippet:
```svelte
<script module>
	export { greeting };
</script>
<script>
	let message = 'hello';
</script>
{#snippet greeting(name)}
	<p>{message} {name}!</p>
{/snippet}
```

**State**: `state_field_duplicate`, `state_field_invalid_assignment`, `state_invalid_placement`

State field declaration (class body or constructor, once only):
```js
class Counter {
	count = $state(0);
}
```

**Stores**: `store_invalid_scoped_subscription`, `store_invalid_subscription`, `store_invalid_subscription_module`

**Styles**: `style_directive_invalid_modifier`, `style_duplicate`

**Svelte Meta**: `svelte_body_illegal_attribute`, `svelte_boundary_invalid_attribute`, `svelte_boundary_invalid_attribute_value`, `svelte_component_invalid_this`, `svelte_component_missing_this`, `svelte_element_missing_this`, `svelte_fragment_invalid_attribute`, `svelte_fragment_invalid_placement`, `svelte_head_illegal_attribute`, `svelte_meta_duplicate`, `svelte_meta_invalid_content`, `svelte_meta_invalid_placement`, `svelte_meta_invalid_tag`, `title_illegal_attribute`, `title_invalid_content`

**Svelte Options**: `svelte_options_deprecated_tag`, `svelte_options_invalid_attribute`, `svelte_options_invalid_attribute_value`, `svelte_options_invalid_customelement`, `svelte_options_invalid_customelement_props`, `svelte_options_invalid_customelement_shadow`, `svelte_options_invalid_tagname`, `svelte_options_reserved_tagname`, `svelte_options_unknown_attribute`

**Svelte Self**: `svelte_self_invalid_placement`

**Tags**: `tag_invalid_name`, `tag_invalid_placement`

**Textarea**: `textarea_invalid_content`

**Transitions**: `transition_conflict`, `transition_duplicate`

**TypeScript**: `typescript_invalid_feature`

**Parsing**: `expected_attribute_value`, `expected_block_type`, `expected_identifier`, `expected_pattern`, `expected_token`, `expected_whitespace`, `invalid_arguments_usage`, `js_parse_error`, `unexpected_eof`, `unexpected_reserved_word`, `unterminated_string_constant`

**Async**: `experimental_async`