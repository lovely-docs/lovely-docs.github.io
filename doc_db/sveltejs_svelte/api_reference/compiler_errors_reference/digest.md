## Compiler Errors Reference

Complete list of Svelte compiler error codes with descriptions and explanations.

### Animation Errors
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element using `animate:` must be the only child of a keyed `{#each}` block
- `animation_missing_key`: Element using `animate:` must be in a keyed `{#each}` block

### Attribute Errors
- `attribute_contenteditable_dynamic`: `contenteditable` cannot be dynamic with two-way binding
- `attribute_contenteditable_missing`: `contenteditable` required for textContent/innerHTML/innerText bindings
- `attribute_duplicate`: Attributes must be unique
- `attribute_empty_shorthand`: Attribute shorthand cannot be empty
- `attribute_invalid_event_handler`: Event attributes must be JavaScript expressions, not strings
- `attribute_invalid_multiple`: `multiple` attribute must be static if select uses two-way binding
- `attribute_invalid_name`: Invalid attribute name
- `attribute_invalid_sequence_expression`: Sequence expressions not allowed as attribute values in runes mode unless wrapped in parentheses
- `attribute_invalid_type`: `type` attribute must be static if input uses two-way binding
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless value only contains the expression

### Binding Errors
- `bind_group_invalid_expression`: `bind:group` can only bind to Identifier or MemberExpression
- `bind_group_invalid_snippet_parameter`: Cannot `bind:group` to snippet parameter
- `bind_invalid_expression`: Can only bind to Identifier, MemberExpression, or `{get, set}` pair
- `bind_invalid_name`: Invalid binding name
- `bind_invalid_parens`: `bind:%name%={get, set}` must not have surrounding parentheses
- `bind_invalid_target`: `bind:%name%` can only be used with specific elements
- `bind_invalid_value`: Can only bind to state or props

### Block Errors
- `block_duplicate_clause`: Block clause cannot appear more than once
- `block_invalid_continuation_placement`: `{:...}` block invalid at this position
- `block_invalid_elseif`: Use `else if` instead of `elseif`
- `block_invalid_placement`: `{#%name%}` block cannot be at this location
- `block_unclosed`: Block was left open
- `block_unexpected_character`: Expected specific character after opening bracket
- `block_unexpected_close`: Unexpected block closing tag

### Component Errors
- `component_invalid_directive`: Directive type not valid on components
- `svelte_component_invalid_this`: Invalid component definition
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute

### Const Tag Errors
- `const_tag_cycle`: Cyclical dependency detected
- `const_tag_invalid_expression`: `{@const}` must be single variable declaration
- `const_tag_invalid_placement`: `{@const}` must be immediate child of specific blocks/components
- `const_tag_invalid_reference`: Const declaration not available in snippet scope

Example of invalid const reference:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error: foo not available -->
    {/snippet}
</svelte:boundary>
```

### State and Assignment Errors
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array index instead
- `state_field_duplicate`: State field already declared
- `state_field_invalid_assignment`: Cannot assign to state field before declaration
- `state_invalid_export`: Cannot export state from module if reassigned
- `state_invalid_placement`: State rune can only be used as variable/class field declaration or first assignment in constructor

### CSS Errors
- `css_empty_declaration`: Declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` selector cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {}` can only contain rules
- `css_global_block_invalid_list`: `:global` cannot be mixed with non-global selectors in list
- `css_global_block_invalid_modifier`: `:global` cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` can only be modified if descendant of other selectors
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` can be at start or end, not middle
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` must not contain type/universal selectors in compound selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only in rules or first in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` must not be followed by type selector

Invalid CSS example:
```css
:global, x {
    y { color: red; }
}
```
Split into:
```css
:global { y { color: red; } }
x y { color: red; }
```

### Debug and Inspection
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers
- `inspect_trace_generator`: `$inspect.trace()` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace()` must be first statement in function

### Declaration Errors
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`
- `duplicate_class_field`: Class field already declared

### Directive Errors
- `directive_invalid_value`: Directive value must be JavaScript expression in curly braces
- `directive_missing_name`: Directive name cannot be empty
- `event_handler_invalid_component_modifier`: Only `once` modifier valid on components
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Modifiers cannot be used together
- `let_directive_invalid_placement`: `let:` directive at invalid position
- `style_directive_invalid_modifier`: `style:` directive only supports `important` modifier

### Element Errors
- `element_invalid_closing_tag`: Attempted to close element that wasn't open
- `element_invalid_closing_tag_autoclosed`: Element already auto-closed by another element
- `element_unclosed`: Element left open
- `illegal_element_attribute`: Element doesn't support non-event attributes or spreads
- `node_invalid_placement`: Element placement violates HTML restrictions; browser will repair HTML breaking Svelte assumptions
- `textarea_invalid_content`: `<textarea>` can have value attribute OR child content, not both
- `title_illegal_attribute`: `<title>` cannot have attributes or directives
- `title_invalid_content`: `<title>` can only contain text and tags
- `void_element_invalid_content`: Void elements cannot have children or closing tags

### Export and Module Errors
- `derived_invalid_export`: Cannot export derived state; export function returning value instead
- `export_undefined`: Variable not defined
- `legacy_export_invalid`: Cannot use `export let` in runes mode; use `$props()` instead
- `module_illegal_default_export`: Component cannot have default export
- `snippet_invalid_export`: Exported snippet can only reference things in `<script module>` or other exportable snippets

Example of invalid exported snippet:
```svelte
<script module>
    export { greeting };
</script>
<script>
    let message = 'hello';
</script>
{#snippet greeting(name)}
    <p>{message} {name}!</p>  <!-- error: references module-level script -->
{/snippet}
```

### Props and Runes
- `bindable_invalid_location`: `$bindable()` only in `$props()` declaration
- `props_duplicate`: Cannot use `$props()` more than once
- `props_id_invalid_placement`: `$props.id()` only at component top level as variable initializer
- `props_illegal_name`: Props starting with `$$` reserved for Svelte internals
- `props_invalid_identifier`: `$props()` only with object destructuring
- `props_invalid_pattern`: `$props()` assignment cannot have nested properties or computed keys
- `props_invalid_placement`: `$props()` only at component top level as variable initializer
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_arguments_length`: Rune must be called with specific number of arguments
- `rune_invalid_computed_property`: Cannot access computed property of rune
- `rune_invalid_name`: Not a valid rune
- `rune_invalid_spread`: Rune cannot be called with spread argument
- `rune_invalid_usage`: Cannot use rune in non-runes mode
- `rune_missing_parentheses`: Rune must have parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name
- `runes_mode_invalid_import`: Specific import cannot be used in runes mode

### Snippet Errors
- `render_tag_invalid_call_expression`: Cannot call snippet using apply/bind/call
- `render_tag_invalid_expression`: `{@render}` can only contain call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread arguments in `{@render}`
- `snippet_conflict`: Cannot use `<slot>` and `{@render}` in same component
- `snippet_invalid_rest_parameter`: Snippets don't support rest parameters; use array
- `snippet_parameter_assignment`: Cannot reassign or bind to snippet parameter
- `snippet_shadowing_prop`: Snippet shadows prop with same name

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name
- `slot_attribute_invalid`: Slot attribute must be static
- `slot_attribute_invalid_placement`: Element with slot attribute must be child of component
- `slot_default_duplicate`: Default slot content alongside explicit `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` can only receive attributes and let directives
- `slot_element_invalid_name`: Slot attribute must be static
- `slot_element_invalid_name_default`: `default` reserved; cannot be slot name
- `slot_snippet_conflict`: Cannot mix `<slot>` and `{@render}` tags

### Svelte Meta Tags
- `svelte_body_illegal_attribute`: `<svelte:body>` doesn't support non-event attributes or spreads
- `svelte_boundary_invalid_attribute`: Valid attributes: `onerror` and `failed`
- `svelte:boundary_invalid_attribute_value`: Attribute value must be non-string expression
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` can only have slot attribute and let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes or directives
- `svelte_meta_duplicate`: Component can only have one meta element
- `svelte_meta_invalid_content`: Meta element cannot have children
- `svelte_meta_invalid_placement`: Meta tags cannot be inside elements or blocks
- `svelte_meta_invalid_tag`: Invalid svelte meta tag name
- `svelte_options_deprecated_tag`: `tag` option deprecated; use `customElement` instead
- `svelte_options_invalid_attribute`: `<svelte:options>` only receives static attributes
- `svelte_options_invalid_attribute_value`: Invalid attribute value
- `svelte_options_invalid_customelement`: `customElement` must be string or object with tag/shadow/props
- `svelte_options_invalid_customelement_props`: Props must be statically analyzable object
- `svelte_options_invalid_customelement_shadow`: `shadow` must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name is reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute
- `svelte_self_invalid_placement`: `<svelte:self>` only in if/each/snippet blocks or component slots

### Script Errors
- `script_duplicate`: Component can have one `<script>` and one `<script module>`
- `script_invalid_attribute_value`: Script attribute must be boolean
- `script_invalid_context`: Context attribute must be "module"
- `script_reserved_attribute`: Attribute is reserved
- `style_duplicate`: Component can have single `<style>` element

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to non-top-level stores
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Store subscription only in `.svelte` files

### Other Errors
- `dollar_binding_invalid`: `$` name reserved; cannot use for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved; cannot use for variables/imports
- `effect_invalid_placement`: `$effect()` only as expression statement
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected if/each/await/key/snippet
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `experimental_async`: Cannot use `await` unless `experimental.async` compiler option true
- `global_reference_invalid`: Illegal variable name; use `globalThis.%name%` for globals
- `host_invalid_placement`: `$host()` only in custom element component instances
- `import_svelte_internal_forbidden`: Cannot import from `svelte/internal/*`
- `invalid_arguments_usage`: `arguments` keyword not in template or top level
- `js_parse_error`: JavaScript parse error
- `legacy_await_invalid`: Cannot use `await` in deriveds/templates unless in runes mode
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode; use `$derived` or `$effect`
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes
- `options_invalid_value`: Invalid compiler option
- `options_removed`: Compiler option removed
- `options_unrecognised`: Unrecognised compiler option
- `reactive_declaration_cycle`: Cyclical dependency detected
- `tag_invalid_name`: Invalid element/component name
- `tag_invalid_placement`: Tag cannot be at this location
- `transition_conflict`: Cannot use multiple transition directives
- `transition_duplicate`: Cannot use multiple transition directives
- `typescript_invalid_feature`: TypeScript features not natively supported; use preprocessor
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word cannot be used here
- `unterminated_string_constant`: Unterminated string