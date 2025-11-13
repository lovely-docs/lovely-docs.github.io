## Compile Errors Reference

Comprehensive list of compiler error messages with explanations and examples where applicable.

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
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless the value only contains the expression

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

### Const Tag Errors
- `const_tag_cycle`: Cyclical dependency detected
- `const_tag_invalid_expression`: `{@const}` must be a single variable declaration
- `const_tag_invalid_placement`: `{@const}` must be immediate child of specific blocks/components
- `const_tag_invalid_reference`: Const declaration not available in this snippet

Example of invalid const reference:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error: foo not available -->
    {/snippet}
</svelte:boundary>
```

### Declaration Errors
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant

### CSS Errors
- `css_empty_declaration`: Declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` selector cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {}` can only contain rules, not declarations
- `css_global_block_invalid_list`: `:global` cannot be in selector list with non-global entries

Invalid: `:global, x { y { color: red; } }` - mixing global and scoped selectors
Valid: Split into separate selectors

- `css_global_block_invalid_modifier`: `:global` selector cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` can only be modified if descendant of other selectors
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` can be at start or end, not middle
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` must not contain type/universal selectors in compound selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only in rules or first in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` must not be followed by type selector

### Debug Tag Errors
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers, not expressions

### Derived/Export Errors
- `derived_invalid_export`: Cannot export derived state from module; export function returning value instead
- `state_invalid_export`: Cannot export state from module if reassigned; export function or only mutate properties

### Directive Errors
- `directive_invalid_value`: Directive value must be JavaScript expression in curly braces
- `directive_missing_name`: Directive name cannot be empty

### Dollar Prefix Errors
- `dollar_binding_invalid`: `$` name reserved, cannot use for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved, cannot use for variables/imports

### Each Block Errors
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array/index instead

Legacy mode allowed: `{#each array as entry} <button on:click={() => entry = 4}>` 
Runes mode requires: `{#each array as entry, i} <button onclick={() => array[i] = 4}>`

- `each_key_without_as`: `{#each}` block without `as` clause cannot have key

### Effect Errors
- `effect_invalid_placement`: `$effect()` can only be used as expression statement

### Element Errors
- `element_invalid_closing_tag`: Attempted to close element that was not open
- `element_invalid_closing_tag_autoclosed`: Element already auto-closed by another element
- `element_unclosed`: Element left open
- `void_element_invalid_content`: Void elements cannot have children or closing tags

### Event Handler Errors
- `event_handler_invalid_component_modifier`: Only `once` modifier valid on components
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Modifiers cannot be used together

### Export Errors
- `export_undefined`: Variable not defined before export

### Global Reference Errors
- `global_reference_invalid`: Illegal variable name; use `globalThis.%name%` for globals

### Host Errors
- `host_invalid_placement`: `$host()` only in custom element component instances

### Illegal Attribute Errors
- `illegal_element_attribute`: Element does not support non-event attributes or spread attributes

### Import Errors
- `import_svelte_internal_forbidden`: Imports from `svelte/internal/*` forbidden; contains private runtime code

### Inspect Errors
- `inspect_trace_generator`: `$inspect.trace()` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace()` must be first statement of function body

### Legacy Mode Errors
- `legacy_await_invalid`: Cannot use `await` in deriveds/template expressions at top level unless in runes mode
- `legacy_export_invalid`: Cannot use `export let` in runes mode; use `$props()` instead
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode; use `$derived` or `$effect`
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode

### Let Directive Errors
- `let_directive_invalid_placement`: `let:` directive at invalid position

### Mixed Syntax Errors
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes

### Module Errors
- `module_illegal_default_export`: Component cannot have default export

### Node Placement Errors
- `node_invalid_placement`: Element violates HTML structure rules; browser will repair HTML breaking Svelte assumptions

Examples:
- `<p>hello <div>world</div></p>` becomes `<p>hello </p><div>world</div><p></p>`
- `<option><div>option a</div></option>` becomes `<option>option a</option>`
- `<table><tr><td>cell</td></tr></table>` becomes `<table><tbody><tr><td>cell</td></tr></tbody></table>`

### Options Errors
- `options_invalid_value`: Invalid compiler option value
- `options_removed`: Compiler option removed
- `options_unrecognised`: Unrecognized compiler option

### Props Errors
- `props_duplicate`: Cannot use `%rune%()` more than once
- `props_id_invalid_placement`: `$props.id()` only at top level as variable declaration initializer
- `props_illegal_name`: Cannot declare/access prop starting with `$$` (reserved for Svelte internals)
- `props_invalid_identifier`: `$props()` only with object destructuring pattern
- `props_invalid_pattern`: `$props()` assignment must not contain nested properties or computed keys
- `props_invalid_placement`: `$props()` only at top level as variable declaration initializer

### Reactive Declaration Errors
- `reactive_declaration_cycle`: Cyclical dependency detected

### Render Tag Errors
- `render_tag_invalid_call_expression`: Cannot call snippet using apply/bind/call
- `render_tag_invalid_expression`: `{@render}` can only contain call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread arguments in `{@render}` tags

### Rune Errors
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_arguments_length`: Rune must be called with specific number of arguments
- `rune_invalid_computed_property`: Cannot access computed property of rune
- `rune_invalid_name`: Not a valid rune
- `rune_invalid_spread`: Rune cannot be called with spread argument
- `rune_invalid_usage`: Cannot use rune in non-runes mode
- `rune_missing_parentheses`: Cannot use rune without parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name
- `runes_mode_invalid_import`: Import cannot be used in runes mode

### Script Errors
- `script_duplicate`: Component can have single `<script>` and/or single `<script module>`
- `script_invalid_attribute_value`: Script attribute must be boolean if supplied
- `script_invalid_context`: Context attribute value must be "module"
- `script_reserved_attribute`: Attribute is reserved

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name in component
- `slot_attribute_invalid`: Slot attribute must be static value
- `slot_attribute_invalid_placement`: Element with `slot=` must be child of component or descendant of custom element
- `slot_default_duplicate`: Found default slot content alongside explicit `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` can only receive attributes and let directives
- `slot_element_invalid_name`: Slot attribute must be static value
- `slot_element_invalid_name_default`: `default` is reserved; cannot use as slot name
- `slot_snippet_conflict`: Cannot use `<slot>` and `{@render}` tags in same component

### Snippet Errors
- `snippet_conflict`: Cannot use implicit children content with explicit children snippet
- `snippet_invalid_export`: Exported snippet can only reference things in `<script module>` or other exportable snippets

Invalid:
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

- `snippet_invalid_rest_parameter`: Snippets don't support rest parameters; use array instead
- `snippet_parameter_assignment`: Cannot reassign/bind to snippet parameter
- `snippet_shadowing_prop`: Snippet shadows prop with same name

### State Errors
- `state_field_duplicate`: State field already declared on class
- `state_field_invalid_assignment`: Cannot assign to state field before declaration

State field declaration can happen in class body or constructor, but only once:
```js
class Counter {
	count = $state(0);  // or in constructor: this.count = $state(0);
}
```

- `state_invalid_placement`: `%rune%()` only as variable declaration initializer, class field declaration, or first assignment in constructor

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to stores not declared at top level
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Cannot reference store value outside `.svelte` file; use runes instead

### Style Errors
- `style_directive_invalid_modifier`: `style:` directive can only use `important` modifier
- `style_duplicate`: Component can have single `<style>` element

### Svelte Meta Element Errors
- `svelte_body_illegal_attribute`: `<svelte:body>` does not support non-event attributes or spread attributes
- `svelte_boundary_invalid_attribute`: Valid attributes on `<svelte:boundary>` are `onerror` and `failed`
- `svelte_boundary_invalid_attribute_value`: Attribute value must be non-string expression
- `svelte_component_invalid_this`: Invalid component definition; must be expression
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute with value
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` can only have slot attribute and optional let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes or directives
- `svelte_meta_duplicate`: Component can only have one `<%name%>` element
- `svelte_meta_invalid_content`: `<%name%>` cannot have children
- `svelte_meta_invalid_placement`: `<%name%>` tags cannot be inside elements or blocks
- `svelte_meta_invalid_tag`: Invalid `<svelte:...>` tag name
- `title_illegal_attribute`: `<title>` cannot have attributes or directives
- `title_invalid_content`: `<title>` can only contain text and `{tags}`

### Svelte Options Errors
- `svelte_options_deprecated_tag`: "tag" option deprecated; use "customElement" instead
- `svelte_options_invalid_attribute`: `<svelte:options>` can only receive static attributes
- `svelte_options_invalid_attribute_value`: Value must be from specific list
- `svelte_options_invalid_customelement`: "customElement" must be string literal or object with tag/shadow/props
- `svelte_options_invalid_customelement_props`: "props" must be object literal with format `{ [key: string]: { attribute?: string; reflect?: boolean; type?: "String" | "Boolean" | "Number" | "Array" | "Object" } }`
- `svelte_options_invalid_customelement_shadow`: "shadow" must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name is reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute

### Svelte Self Errors
- `svelte_self_invalid_placement`: `<svelte:self>` only in `{#if}`, `{#each}`, `{#snippet}` blocks or component slots

### Tag Errors
- `tag_invalid_name`: Invalid element/component name; components need valid variable name or dot notation
- `tag_invalid_placement`: `{@%name%}` tag cannot be at this location

### Textarea Errors
- `textarea_invalid_content`: `<textarea>` can have value attribute OR child content, not both

### Transition Errors
- `transition_conflict`: Cannot use `%type%:` with existing `%existing%:` directive
- `transition_duplicate`: Cannot use multiple `%type%:` directives on single element

### TypeScript Errors
- `typescript_invalid_feature`: TypeScript features like %feature% not natively supported; use preprocessor in `<script>` tags

### Parsing Errors
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected 'if', 'each', 'await', 'key' or 'snippet'
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `invalid_arguments_usage`: `arguments` keyword cannot be used in template or top level
- `js_parse_error`: JavaScript parsing error
- `tag_invalid_name`: Invalid element/component name
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word cannot be used here
- `unterminated_string_constant`: Unterminated string

### Async Errors
- `experimental_async`: Cannot use `await` in deriveds/template expressions/top level unless `experimental.async` compiler option is true