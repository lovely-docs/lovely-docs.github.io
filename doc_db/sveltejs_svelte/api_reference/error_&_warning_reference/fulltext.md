

## Pages

### client-errors
Complete reference of Svelte runtime errors with causes and solutions: reactivity constraints ($derived/$effect rules), binding restrictions, component API changes, state mutation rules, async/fork limitations, and boundary error handling.

## Client-side Error Reference

Comprehensive list of runtime errors that can occur in Svelte applications with explanations and solutions.

### Reactivity Errors

**async_derived_orphan**: Cannot create `$derived(...)` with `await` outside effect tree. Deriveds run lazily and can be garbage collected, but async deriveds need effects to call promises proactively. Solution: create async deriveds inside effects.

**derived_references_self**: A derived cannot reference itself recursively.

**effect_in_unowned_derived**: Effects cannot be created inside `$derived` values that weren't themselves created inside an effect.

**effect_orphan**: `$rune%` can only be used inside effects or during component initialization.

**effect_in_teardown**: `%rune%` cannot be used inside effect cleanup functions.

**effect_pending_outside_reaction**: `$effect.pending()` can only be called inside effects or deriveds.

**effect_update_depth_exceeded**: Maximum update depth exceeded, typically when an effect reads and writes the same state. Example causing infinite loop:
```js
let count = $state(0);
$effect(() => {
	count += 1; // reads and writes count
});
```
Same issue with array mutations:
```js
let array = $state(['hello']);
$effect(() => {
	array.push('goodbye'); // reads and writes array
});
```
Solution: use `untrack()` to read state without adding dependency, or make non-state values (like logs arrays) regular variables instead of `$state()`.

**state_unsafe_mutation**: Updating state inside `$derived(...)`, `$inspect(...)` or template expressions is forbidden. Example:
```svelte
<script>
	let count = $state(0);
	let even = $state(true);
	let odd = $derived.by(() => {
		even = count % 2 === 0; // forbidden
		return !even;
	});
</script>
```
Solution: make everything derived:
```js
let count = 0;
let even = $derived(count % 2 === 0);
let odd = $derived(!even);
```
Or use `$effect` for side-effects.

### Binding Errors

**bind_invalid_checkbox_value**: Using `bind:value` with checkbox input is not allowed. Use `bind:checked` instead.

**bind_invalid_export**: Component has export that consumer tries to access via `bind:%key%`, which is disallowed. Solution: use `bind:this` to bind component instance, then access property on it.

**bind_not_bindable**: Attempting to bind to non-bindable property. Solution: mark property as bindable with `let { %key% = $bindable() } = $props()`.

**props_invalid_value**: Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value.

**props_rest_readonly**: Rest element properties of `$props()` are readonly.

### Component Errors

**component_api_changed**: Calling `%method%` on component instance is no longer valid in Svelte 5.

**component_api_invalid_new**: Attempted to instantiate component with `new %name%`, no longer valid in Svelte 5. Solution: set `compatibility.componentApi` compiler option to `4` to keep working.

### Loop Errors

**each_key_duplicate**: Keyed each block has duplicate key at indexes or with value `%value%` at indexes.

### Context & Lifecycle Errors

**set_context_after_init**: `setContext` must be called during component initialization, not in subsequent effects or after `await`. (Applies with `experimental.async` option, default in Svelte 6)

**lifecycle_legacy_only**: `%name%(...)` cannot be used in runes mode.

### State Errors

**state_descriptors_fixed**: Property descriptors on `$state` objects must contain `value` and be `enumerable`, `configurable`, and `writable`.

**state_prototype_fixed**: Cannot set prototype of `$state` object.

### Async/Fork Errors

**experimental_async_fork**: Cannot use `fork(...)` unless `experimental.async` compiler option is `true`.

**fork_discarded**: Cannot commit fork that was already discarded.

**fork_timing**: Cannot create fork inside effect or when state changes are pending.

**flush_sync_in_effect**: Cannot use `flushSync` inside effect. Can call after state change but not during effect flushing. (Applies with `experimental.async` option)

### Other Errors

**get_abort_signal_outside_reaction**: `getAbortSignal()` can only be called inside effects or deriveds.

**hydration_failed**: Failed to hydrate the application.

**invalid_snippet**: Could not `{@render}` snippet because expression is `null` or `undefined`. Solution: use optional chaining `{@render snippet?.()}`.

**rune_outside_svelte**: `%rune%` rune only available inside `.svelte` and `.svelte.js/ts` files.

**svelte_boundary_reset_onerror**: `<svelte:boundary>` `reset` function cannot be called while error is being handled. Solution: wait for boundary to settle before calling `reset()`, e.g. with `await tick()`:
```svelte
<svelte:boundary onerror={async (error, reset) => {
	fixTheError();
	await tick();
	reset();
}>
</svelte:boundary>
```

### client-warnings
18 client-side warnings covering state mutations, reactivity tracking, hydration mismatches, component ownership, and lifecycle issues with fixes for each.

Reference documentation for Svelte client-side warnings. Each warning explains a potential issue and how to fix it.

**assignment_value_stale**: Assignment operators like `??=` evaluate to the right-hand side value, not the final state value. This can cause unexpected behavior when chaining operations. Fix by separating into two statements:
```js
object.array ??= [];
object.array.push(object.array.length);
```

**await_reactivity_loss**: State read in async functions after an `await` may not be tracked for reactivity. Pass values as function parameters instead of reading them inside the async function:
```js
async function sum(a, b) { return await a + b; }
let total = $derived(await sum(a, b));
```

**await_waterfall**: Multiple `$derived(await ...)` expressions create unnecessary waterfalls where the second waits for the first to resolve. Create promises first, then await them:
```js
let aPromise = $derived(one());
let bPromise = $derived(two());
let a = $derived(await aPromise);
let b = $derived(await bPromise);
```

**binding_property_non_reactive**: Binding to a non-reactive property.

**console_log_state**: Logging `$state` proxies shows the proxy object, not the value. Use `$inspect(...)` or `$state.snapshot(...)` instead.

**event_handler_invalid**: Event handler is not a function.

**hydration_attribute_changed**: Certain attributes like `src` on `<img>` won't update during hydration. Ensure values match between server and client, or force an update in an `$effect`:
```svelte
<script>
  let { src } = $props();
  if (typeof window !== 'undefined') {
    const initial = src;
    src = undefined;
    $effect(() => { src = initial; });
  }
</script>
<img {src} />
```

**hydration_html_changed**: `{@html ...}` values that differ between server and client won't update during hydration. Use the same pattern as hydration_attribute_changed.

**hydration_mismatch**: Server-rendered HTML structure doesn't match client expectations. Usually caused by invalid HTML that the DOM repairs.

**invalid_raw_snippet_render**: `createRawSnippet` render function must return HTML for a single element.

**legacy_recursive_reactive_block**: Migrated `$:` reactive blocks that both read and update the same value may cause recursive updates when converted to `$effect`.

**lifecycle_double_unmount**: Attempted to unmount a component that wasn't mounted.

**ownership_invalid_binding**: Parent component didn't declare a binding that child is trying to bind to. Use `bind:` in parent instead of just passing the property:
```svelte
<!-- GrandParent -->
<Parent bind:value />
<!-- instead of -->
<Parent {value} />
```

**ownership_invalid_mutation**: Mutating unbound props is discouraged. Use `bind:` or callbacks instead, or mark the prop as `$bindable`:
```svelte
<!-- App.svelte -->
<Child bind:person />
<!-- or in Child.svelte -->
<script>
  let { person = $bindable() } = $props();
</script>
```

**select_multiple_invalid_value**: `<select multiple>` value must be an array, null, or undefined.

**state_proxy_equality_mismatch**: `$state(...)` creates a proxy with different identity than the original value, so equality checks fail. Compare values where both or neither are created with `$state(...)`.

**state_proxy_unmount**: `unmount()` was called with a `$state` proxy instead of a component. Use `$state.raw()` if the component needs to be reactive.

**svelte_boundary_reset_noop**: `<svelte:boundary>` reset function only works the first time it's called. Don't store a reference to it outside the boundary.

**transition_slide_display**: The `slide` transition animates height and doesn't work with `display: inline`, `inline-*`, `table`, `table-*`, or `contents`.

### compile-errors
Complete reference of 200+ Svelte compiler error codes with descriptions, organized by feature (animations, attributes, bindings, blocks, components, CSS, declarations, directives, each blocks, effects, elements, event handlers, exports, imports, legacy syntax, modules, props, runes, scripts, slots, snippets, state, stores, styles, svelte elements, transitions, TypeScript); includes examples for complex errors like const tag scoping, CSS :global mixing, each block reassignment in runes mode, node placement HTML repair, snippet export restrictions, and state field declarations.

## Compile Errors Reference

Complete list of Svelte compiler error codes with descriptions and examples.

### Animation Errors
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element using `animate:` must be only child of keyed `{#each}` block
- `animation_missing_key`: Element using `animate:` must be in keyed `{#each}` block (forgot key?)

### Attribute Errors
- `attribute_contenteditable_dynamic`: `contenteditable` cannot be dynamic with two-way binding
- `attribute_contenteditable_missing`: `contenteditable` required for textContent/innerHTML/innerText bindings
- `attribute_duplicate`: Attributes must be unique
- `attribute_empty_shorthand`: Attribute shorthand cannot be empty
- `attribute_invalid_event_handler`: Event attributes must be JS expressions, not strings
- `attribute_invalid_multiple`: `multiple` must be static if select uses two-way binding
- `attribute_invalid_name`: Invalid attribute name
- `attribute_invalid_sequence_expression`: Sequence expressions not allowed as attribute values in runes mode unless wrapped in parentheses
- `attribute_invalid_type`: `type` must be static if input uses two-way binding
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless value only contains expression

### Binding Errors
- `bind_group_invalid_expression`: `bind:group` only binds to Identifier or MemberExpression
- `bind_group_invalid_snippet_parameter`: Cannot `bind:group` to snippet parameter
- `bind_invalid_expression`: Can only bind to Identifier, MemberExpression, or `{get, set}` pair
- `bind_invalid_name`: Invalid binding name
- `bind_invalid_parens`: `bind:%name%={get, set}` must not have surrounding parentheses
- `bind_invalid_target`: `bind:%name%` only works with specific elements
- `bind_invalid_value`: Can only bind to state or props

### Block Errors
- `block_duplicate_clause`: Block clause cannot appear more than once
- `block_invalid_continuation_placement`: `{:...}` block invalid (unclosed element/block?)
- `block_invalid_elseif`: Use `else if` not `elseif`
- `block_invalid_placement`: `{#%name%}` block cannot be in this location
- `block_unclosed`: Block left open
- `block_unexpected_character`: Expected specific character after opening bracket
- `block_unexpected_close`: Unexpected block closing tag

### Component Errors
- `component_invalid_directive`: Directive type not valid on components

### Const Tag Errors
- `const_tag_cycle`: Cyclical dependency in `{@const}` declaration
- `const_tag_invalid_expression`: `{@const}` must be single variable declaration
- `const_tag_invalid_placement`: `{@const}` must be immediate child of `{#snippet}`, `{#if}`, `{:else if}`, `{:else}`, `{#each}`, `{:then}`, `{:catch}`, `<svelte:fragment>`, `<svelte:boundary>`, or `<Component>`
- `const_tag_invalid_reference`: Declaration not available in this snippet

Example of invalid reference:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error: foo not available -->
    {/snippet}
</svelte:boundary>
```
The top-level code becomes part of implicit `children` snippet, so `foo` is scoped there. Same applies to components with snippet props.

### Assignment/Binding Errors
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant

### CSS Errors
- `css_empty_declaration`: Declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {...}` can only contain rules, not declarations
- `css_global_block_invalid_list`: `:global` cannot mix with non-global selectors in list

Example of invalid CSS:
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

- `css_global_block_invalid_modifier`: `:global` cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` only modifiable if descendant of other selectors
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` only at start or end of selector sequence
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` cannot contain type/universal selectors in compound selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only inside rule or first in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` cannot be followed by type selector

### Debug/Declaration Errors
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers, not expressions
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`

### Derived/Export Errors
- `derived_invalid_export`: Cannot export derived state; export function returning value instead
- `directive_invalid_value`: Directive value must be JS expression in curly braces
- `directive_missing_name`: Directive name cannot be empty

### Dollar Prefix Errors
- `dollar_binding_invalid`: `$` reserved, cannot use for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved, cannot use for variables/imports

### Class/Each Errors
- `duplicate_class_field`: Class field already declared
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array/index instead

Example (legacy mode allowed):
```svelte
<script>
	let array = [1, 2, 3];
</script>
{#each array as entry}
	<button on:click={() => entry = 4}>change</button>
	<input bind:value={entry}>
{/each}
```

In runes mode, use index:
```svelte
<script>
	let array = $state([1, 2, 3]);
</script>
{#each array as entry, i}
	<button onclick={() => array[i] = 4}>change</button>
	<input bind:value={array[i]}>
{/each}
```

- `each_key_without_as`: `{#each}` without `as` clause cannot have key

### Effect/Element Errors
- `effect_invalid_placement`: `$effect()` only as expression statement
- `element_invalid_closing_tag`: Closing tag for unopened element
- `element_invalid_closing_tag_autoclosed`: Closing tag for auto-closed element (nesting violation)
- `element_unclosed`: Element left open

### Event Handler Errors
- `event_handler_invalid_component_modifier`: Only `once` modifier on components; others only on DOM elements
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Incompatible modifier combination

### Expected/Experimental Errors
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected `if`, `each`, `await`, `key`, or `snippet`
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `experimental_async`: Cannot use `await` in deriveds/template expressions/top-level unless `experimental.async` compiler option is true

### Export/Global Errors
- `export_undefined`: Variable not defined
- `global_reference_invalid`: Illegal variable name; use `globalThis.%name%` for globals

### Host/Illegal Errors
- `host_invalid_placement`: `$host()` only in custom element component instances
- `illegal_element_attribute`: Element doesn't support non-event/spread attributes

### Import/Inspect Errors
- `import_svelte_internal_forbidden`: Cannot import from `svelte/internal/*` (private, subject to change)
- `inspect_trace_generator`: `$inspect.trace()` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace()` must be first statement in function body

### Invalid/JS Parse Errors
- `invalid_arguments_usage`: `arguments` keyword not in template or top-level component
- `js_parse_error`: JavaScript parse error

### Legacy Errors
- `legacy_await_invalid`: Cannot use `await` in deriveds/template expressions/top-level unless in runes mode
- `legacy_export_invalid`: Cannot use `export let` in runes mode; use `$props()` instead
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode; use `$derived` or `$effect`
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode

### Let/Mixed/Module Errors
- `let_directive_invalid_placement`: `let:` directive at invalid position
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes
- `module_illegal_default_export`: Component cannot have default export

### Node/Options Errors
- `node_invalid_placement`: Element placement violates HTML restrictions; browser will repair HTML breaking Svelte assumptions

Examples:
- `<p>hello <div>world</div></p>` → `<p>hello </p><div>world</div><p></p>` (div closes p)
- `<option><div>option a</div></option>` → `<option>option a</option>` (div removed)
- `<table><tr><td>cell</td></tr></table>` → `<table><tbody><tr><td>cell</td></tr></tbody></table>` (tbody inserted)

- `options_invalid_value`: Invalid compiler option
- `options_removed`: Removed compiler option
- `options_unrecognised`: Unrecognized compiler option

### Props Errors
- `props_duplicate`: Cannot use `%rune%()` more than once
- `props_id_invalid_placement`: `$props.id()` only at top level as variable declaration initializer
- `props_illegal_name`: Cannot declare/access prop starting with `$$` (reserved)
- `props_invalid_identifier`: `$props()` only with object destructuring pattern
- `props_invalid_pattern`: `$props()` cannot contain nested properties or computed keys
- `props_invalid_placement`: `$props()` only at top level as variable declaration initializer

### Reactive/Render Errors
- `reactive_declaration_cycle`: Cyclical dependency in reactive declaration
- `render_tag_invalid_call_expression`: Cannot call snippet using apply/bind/call
- `render_tag_invalid_expression`: `{@render}` only contains call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread in `{@render}` tags

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

### Runes Mode/Script Errors
- `runes_mode_invalid_import`: Cannot use in runes mode
- `script_duplicate`: Component can have single `<script>` and/or single `<script module>`
- `script_invalid_attribute_value`: Script attribute must be boolean
- `script_invalid_context`: Context attribute must be "module"
- `script_reserved_attribute`: Attribute is reserved
- `bindable_invalid_location`: `$bindable()` only inside `$props()` declaration

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name in component
- `slot_attribute_invalid`: Slot attribute must be static
- `slot_attribute_invalid_placement`: Element with `slot=` must be child of component or descendant of custom element
- `slot_default_duplicate`: Default slot content alongside explicit `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` only receives attributes and let directives
- `slot_element_invalid_name`: Slot attribute must be static
- `slot_element_invalid_name_default`: `default` reserved; cannot use as slot name
- `slot_snippet_conflict`: Cannot use `<slot>` and `{@render}` in same component

### Snippet Errors
- `snippet_conflict`: Cannot use explicit children snippet with implicit children content
- `snippet_invalid_export`: Exported snippet only references `<script module>` or other exportable snippets

Example of invalid export:
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

- `snippet_invalid_rest_parameter`: Snippets don't support rest parameters; use array
- `snippet_parameter_assignment`: Cannot reassign/bind to snippet parameter
- `snippet_shadowing_prop`: Snippet shadows prop with same name

### State Errors
- `state_field_duplicate`: State field already declared on class

Example:
```js
class Counter {
	count = $state(0);  // declaration in class body
}
// or in constructor:
class Counter {
	constructor() {
		this.count = $state(0);  // only happens once
	}
}
```

- `state_field_invalid_assignment`: Cannot assign to state field before declaration
- `state_invalid_export`: Cannot export state from module if reassigned; export function or only mutate properties
- `state_invalid_placement`: `%rune%()` only as variable declaration initializer, class field declaration, or first assignment in constructor

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to stores not declared at top level
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Cannot reference store value outside `.svelte` file

Using `$` prefix only works in `.svelte` files where Svelte auto-subscribes on mount/unmount. Consider migrating to runes.

### Style/Svelte Errors
- `style_directive_invalid_modifier`: `style:` only uses `important` modifier
- `style_duplicate`: Component can have single `<style>` element
- `svelte_body_illegal_attribute`: `<svelte:body>` doesn't support non-event/spread attributes
- `svelte_boundary_invalid_attribute`: Valid attributes: `onerror`, `failed`
- `svelte_boundary_invalid_attribute_value`: Attribute must be non-string expression
- `svelte_component_invalid_this`: Invalid component definition; must be expression
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute with value
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` only has slot attribute and optional let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes/directives
- `svelte_meta_duplicate`: Component can only have one `<%name%>` element
- `svelte_meta_invalid_content`: `<%name%>` cannot have children
- `svelte_meta_invalid_placement`: `<%name%>` cannot be inside elements/blocks
- `svelte_meta_invalid_tag`: Invalid `<svelte:...>` tag name
- `svelte_options_deprecated_tag`: "tag" option deprecated; use "customElement"
- `svelte_options_invalid_attribute`: `<svelte:options>` only static attributes
- `svelte_options_invalid_attribute_value`: Value must be specific list
- `svelte_options_invalid_customelement`: "customElement" must be string literal or object with `tag`, `shadow`, `props`
- `svelte_options_invalid_customelement_props`: "props" must be static object literal with `attribute`, `reflect`, `type` properties
- `svelte_options_invalid_customelement_shadow`: "shadow" must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name is reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute
- `svelte_self_invalid_placement`: `<svelte:self>` only in `{#if}`, `{#each}`, `{#snippet}` blocks or component slots

### Tag/Textarea/Title Errors
- `tag_invalid_name`: Invalid element/component name
- `tag_invalid_placement`: `{@%name%}` tag cannot be in this location
- `textarea_invalid_content`: `<textarea>` has either value attribute or child content, not both
- `title_illegal_attribute`: `<title>` cannot have attributes/directives
- `title_invalid_content`: `<title>` only text and `{tags}`

### Transition/TypeScript Errors
- `transition_conflict`: Cannot use `%type%:` with existing `%existing%:` directive
- `transition_duplicate`: Cannot use multiple `%type%:` directives on element
- `typescript_invalid_feature`: TypeScript features not natively supported; use preprocessor in `<script>` tags (e.g., `vitePreprocess({ script: true })`)

### Misc Errors
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word cannot be used here
- `unterminated_string_constant`: Unterminated string
- `void_element_invalid_content`: Void elements cannot have children/closing tags

### compile-warnings
Comprehensive reference of 100+ compiler warnings covering accessibility (a11y) rules, deprecated syntax, code quality issues, and reactivity gotchas in Svelte 5.

## Accessibility Warnings (a11y_*)

**a11y_accesskey**: Avoid `accesskey` attribute - creates keyboard shortcut conflicts with screen readers.
```svelte
<div accesskey="z"></div> <!-- warning -->
```

**a11y_aria_activedescendant_has_tabindex**: Elements with `aria-activedescendant` must have `tabindex`.
```svelte
<div aria-activedescendant="some-id"></div> <!-- warning -->
```

**a11y_aria_attributes**: Reserved elements (`meta`, `html`, `script`, `style`) should not have `aria-*` attributes.
```svelte
<meta aria-hidden="false" /> <!-- warning -->
```

**a11y_autofocus**: Avoid `autofocus` - causes usability issues.
```svelte
<input autofocus /> <!-- warning -->
```

**a11y_click_events_have_key_events**: Non-interactive elements with `onclick` need keyboard handlers (`onkeyup`/`onkeydown`) and `tabindex`.
```svelte
<div onclick={() => {}}></div> <!-- warning -->
```

**a11y_consider_explicit_label**: Buttons and links need text or `aria-label`/`aria-labelledby`/`title`.

**a11y_distracting_elements**: Avoid `<marquee>` and `<blink>`.

**a11y_figcaption_index**: `<figcaption>` must be first or last child of `<figure>`.

**a11y_figcaption_parent**: `<figcaption>` must be immediate child of `<figure>`.
```svelte
<div><figcaption>Caption</figcaption></div> <!-- warning -->
```

**a11y_hidden**: Certain elements (`h1-h6`, etc.) should not be hidden with `aria-hidden="true"`.
```svelte
<h2 aria-hidden="true">invisible header</h2> <!-- warning -->
```

**a11y_img_redundant_alt**: `alt` text should not contain "image", "picture", or "photo" (screen readers already announce it).
```svelte
<img src="foo" alt="Photo of foo" /> <!-- warning -->
```

**a11y_incorrect_aria_attribute_type**: ARIA attributes must have correct types:
- `aria-hidden`: boolean (`true`/`false`)
- `aria-activedescendant`: DOM element ID
- `aria-labelledby`: space-separated ID list
- `aria-level`: integer
- `aria-sort`: token (`ascending`/`descending`/`none`/`other`)
- `aria-pressed`: tristate (`true`/`false`/`mixed`)
```svelte
<div aria-hidden="yes"></div> <!-- warning: must be true/false -->
```

**a11y_interactive_supports_focus**: Interactive roles (`button`, `link`, etc.) need `tabindex`.
```svelte
<div role="button" onkeypress={() => {}} /> <!-- warning -->
```

**a11y_invalid_attribute**: `href` should not be empty, `#`, or `javascript:`.
```svelte
<a href="">invalid</a> <!-- warning -->
```

**a11y_label_has_associated_control**: Labels must be associated via wrapping or `for` attribute.
```svelte
<label>A</label> <!-- warning: no control -->
<label for="id">B</label> <!-- ok -->
<label>C <input type="text" /></label> <!-- ok -->
```

**a11y_media_has_caption**: `<video>` must have `<track kind="captions">` (unless `muted`).
```svelte
<video></video> <!-- warning -->
<video><track kind="captions" /></video> <!-- ok -->
<audio muted></audio> <!-- ok -->
```

**a11y_misplaced_role**: Reserved elements should not have `role` attribute.
```svelte
<meta role="tooltip" /> <!-- warning -->
```

**a11y_misplaced_scope**: `scope` attribute only for `<th>`.
```svelte
<div scope="row" /> <!-- warning -->
```

**a11y_missing_attribute**: Required attributes:
- `<a>`: `href` (unless fragment-defining)
- `<area>`: `alt`, `aria-label`, or `aria-labelledby`
- `<html>`: `lang`
- `<iframe>`: `title`
- `<img>`: `alt`
- `<object>`: `title`, `aria-label`, or `aria-labelledby`
- `<input type="image">`: `alt`, `aria-label`, or `aria-labelledby`
```svelte
<input type="image" /> <!-- warning -->
<html></html> <!-- warning -->
<a>text</a> <!-- warning -->
```

**a11y_missing_content**: Headings and anchors need text content.
```svelte
<a href="/foo"></a> <!-- warning -->
<h1></h1> <!-- warning -->
```

**a11y_mouse_events_have_key_events**: `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`.
```svelte
<div onmouseover={handler} /> <!-- warning -->
<div onmouseout={handler} /> <!-- warning -->
```

**a11y_no_abstract_role**: Abstract ARIA roles forbidden.

**a11y_no_interactive_element_to_noninteractive_role**: Can't use non-interactive roles (`article`, `banner`, `complementary`, `img`, `listitem`, `main`, `region`, `tooltip`) on interactive elements.
```svelte
<textarea role="listitem"></textarea> <!-- warning -->
```

**a11y_no_noninteractive_element_interactions**: Non-interactive elements (`main`, `area`, `h1-h6`, `p`, `img`, `li`, `ul`, `ol`) shouldn't have event listeners.
```svelte
<li onclick={() => {}}></li> <!-- warning -->
<div role="listitem" onclick={() => {}}></div> <!-- warning -->
```

**a11y_no_noninteractive_element_to_interactive_role**: Can't use interactive roles (`button`, `link`, `checkbox`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `option`, `radio`, `searchbox`, `switch`, `textbox`) on non-interactive elements.
```svelte
<h3 role="searchbox">Button</h3> <!-- warning -->
```

**a11y_no_noninteractive_tabindex**: Non-interactive elements shouldn't have non-negative `tabindex`.
```svelte
<div tabindex="0"></div> <!-- warning -->
```

**a11y_no_redundant_roles**: Don't repeat implicit roles.
```svelte
<button role="button">...</button> <!-- warning -->
<img role="img" src="foo.jpg" /> <!-- warning -->
```

**a11y_no_static_element_interactions**: Elements with event handlers need ARIA role.
```svelte
<div onclick={() => ''}></div> <!-- warning -->
```

**a11y_positive_tabindex**: Avoid `tabindex > 0` - breaks tab order.
```svelte
<div tabindex="1"></div> <!-- warning -->
```

**a11y_role_has_required_aria_props**: ARIA roles require specific attributes.
```svelte
<span role="checkbox" aria-labelledby="foo" tabindex="0"></span> <!-- warning: needs aria-checked -->
```

**a11y_role_supports_aria_props**: Only use ARIA attributes supported by the role.
```svelte
<div role="link" aria-multiline></div> <!-- warning -->
<li aria-required></li> <!-- warning: not supported by implicit listitem role -->
```

**a11y_unknown_aria_attribute**: Only valid ARIA attributes (per WAI-ARIA spec).
```svelte
<input type="image" aria-labeledby="foo" /> <!-- warning: did you mean aria-labelledby? -->
```

**a11y_unknown_role**: Only valid, non-abstract ARIA roles.
```svelte
<div role="toooltip"></div> <!-- warning: did you mean tooltip? -->
```

## Attribute Warnings

**attribute_avoid_is**: `is` attribute not cross-browser compatible.

**attribute_global_event_reference**: Referencing `globalThis.%name%` without declaration.

**attribute_illegal_colon**: Attributes shouldn't contain `:` (conflicts with directives).

**attribute_invalid_property_name**: Invalid HTML attribute name.
```svelte
<!-- Did you mean 'aria-label' instead of 'aria-lable'? -->
```

**attribute_quoted**: Quoted attributes on components will stringify in future versions.

## Code Quality Warnings

**bidirectional_control_characters**: Bidirectional control characters detected - can alter code behavior (see trojansource.codes).

**bind_invalid_each_rest**: Rest operator in `{#each}` creates new object, breaking bindings.

**block_empty**: Empty block detected.

**component_name_lowercase**: Components must start with capital letter.
```svelte
<myComponent /> <!-- warning: treated as HTML -->
```

**css_unused_selector**: Unused CSS selectors removed. Use `:global()` for selectors targeting `{@html}` or child components.
```svelte
<div class="post">{@html content}</div>
<style>
  .post :global(p) { /* ... */ }
</style>
```

**custom_element_props_identifier**: Using rest element or non-destructured `$props()` prevents custom element prop inference. Destructure or specify `customElement.props`.

**element_implicitly_closed**: Some HTML elements auto-close (e.g., `<p>` inside `<p>`). Add explicit closing tags.

**element_invalid_self_closing_tag**: HTML has no self-closing tags. Use `<div></div>` not `<div />`.
```svelte
<span class="icon" /> some text <!-- parses as: <span>some text</span> -->
```

**event_directive_deprecated**: Use `on%name%` attribute instead of `on:%name%` directive.

**export_let_unused**: Unused export property. Use `export const` for external-only references.

**legacy_code**: Outdated syntax - use suggested replacement.

**legacy_component_creation**: Svelte 5 components aren't classes. Use `mount()` or `hydrate()` from 'svelte'.

**node_invalid_placement_ssr**: HTML structure violation causes browser repair, breaking hydration. Examples:
- `<p><div></div></p>` → `<p></p><div></div><p></p>`
- `<option><div></div></option>` → `<option></option>`
- `<table><tr><td></td></tr></table>` → `<table><tbody><tr><td></td></tr></tbody></table>`

**non_reactive_update**: Variable reassigned but not declared with `$state()` - won't trigger updates.
```svelte
<script>
  let stale = 'value'; // warning
  let reactive = $state('value'); // ok
</script>
<p>{stale}</p>
<button onclick={() => stale = 'updated'}>update</button> <!-- doesn't update -->
```

**options_deprecated_accessors**: `accessors` option deprecated in runes mode.

**options_deprecated_immutable**: `immutable` option deprecated in runes mode.

**options_missing_custom_element**: Using custom element features without `customElement: true` option.

**options_removed_enable_sourcemap**: `enableSourcemap` removed - source maps always generated.

**options_removed_hydratable**: `hydratable` removed - components always hydratable.

**options_removed_loop_guard_timeout**: `loopGuardTimeout` removed.

**options_renamed_ssr_dom**: `generate: "dom"` → `"client"`, `generate: "ssr"` → `"server"`.

**perf_avoid_inline_class**: Declare classes at top level, not inline.

**perf_avoid_nested_class**: Don't declare classes in nested scopes.

**reactive_declaration_invalid_placement**: Reactive declarations only at top level of instance script.

**reactive_declaration_module_script_dependency**: Module-level reassignments don't trigger reactive statements.

**script_context_deprecated**: Use `module` attribute instead of `context="module"`.
```svelte
<script module>
  let foo = 'bar';
</script>
```

**script_unknown_attribute**: Only `generics`, `lang`, `module` allowed on `<script>`.

**slot_element_deprecated**: Use `{@render}` instead of `<slot>`.

**state_referenced_locally**: Reactive variable referenced after reassignment loses reactivity. Wrap in function for lazy evaluation.
```svelte
<!-- Parent.svelte -->
<script>
  let count = $state(0);
  setContext('count', () => count); // wrap in function
</script>

<!-- Child.svelte -->
<script>
  const count = getContext('count');
</script>
<p>{count()}</p> <!-- call function -->
```

**store_rune_conflict**: Local binding conflicts with `$%name%` store rune. Rename to avoid ambiguity.

**svelte_component_deprecated**: `<svelte:component>` deprecated - components dynamic by default. Use `{@const Component = ...}` or derived values.
```svelte
<!-- Old -->
<svelte:component this={condition ? Y : Z} />

<!-- New -->
{@const Component = condition ? Y : Z}
<Component />
```

**svelte_element_invalid_this**: `<svelte:element this={...}>` should use expression, not string.

**svelte_self_deprecated**: Use self-imports instead of `<svelte:self>`.

**unknown_code**: Unrecognized warning code (possibly typo).


### server-errors
Server-side rendering errors: await in sync render, deprecated html property, unavailable lifecycle methods.

## Server-side rendering errors

### await_invalid
Encountered asynchronous work while rendering synchronously. When calling `render(...)` with a component containing an `await` expression, either await the result of `render` or wrap the `await` (or the component containing it) in a `<svelte:boundary>` with a `pending` snippet.

### html_deprecated
The `html` property of server render results has been deprecated. Use `body` instead.

### lifecycle_function_unavailable
`%name%(...)` is not available on the server. Certain methods such as `mount` cannot be invoked while running in a server context. Avoid calling them eagerly, i.e. not during render.

### shared-errors
Common Svelte runtime errors: snippet/render misuse, lifecycle method placement, context setup, store shape, and element binding constraints.

## Error Reference

### invalid_default_snippet
Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead.

```svelte
// Parent.svelte - WRONG
<List {items} let:entry>
    <span>{entry}</span>
</List>

// List.svelte
<script>
    let { items, children } = $props();
</script>
<ul>
    {#each items as item}
        <li>{@render children(item)}</li>
    {/each}
</ul>
```

The `let:` directive and `{@render children()}` are incompatible APIs.

### invalid_snippet_arguments
A snippet function was passed invalid arguments. Snippets should only be instantiated via `{@render ...}`.

### lifecycle_outside_component
`%name%(...)` can only be used during component initialisation. Must be invoked at the top level of the instance script.

```svelte
<script>
    import { onMount } from 'svelte';

    // WRONG
    function handleClick() {
        onMount(() => {})
    }

    // CORRECT
    onMount(() => {})
</script>
```

### missing_context
Context was not set in a parent component. The `createContext()` utility returns `[get, set]` pair; `get` throws if `set` wasn't called in a parent.

### snippet_without_render_tag
Attempted to render a snippet without `{@render}` block, causing stringification instead of DOM rendering.

```svelte
// WRONG - children not rendered
<script>
    let { children } = $props();
</script>
{children}

// WRONG - parent passes snippet where non-snippet expected
// Parent.svelte
<ChildComponent>
  {#snippet label()}
    <span>Hi!</span>
  {/snippet}
</ChildComponent>

// Child.svelte
<script>
  let { label } = $props();
</script>
<p>{label}</p>

// CORRECT
<p>{@render label()}</p>
```

### store_invalid_shape
`%name%` is not a store with a `subscribe` method.

### svelte_element_invalid_this_value
The `this` prop on `<svelte:element>` must be a string, if defined.

### shared-warnings
Two shared warnings: void elements ignore children; $state.snapshot() returns originals for uncloneable values like DOM elements.

## dynamic_void_element_content

Void elements like `<input>` cannot have content. When using `<svelte:element this="%tag%">` with a void element tag, any children passed will be ignored.

## state_snapshot_uncloneable

`$state.snapshot()` attempts to clone a value to return a reference that no longer changes. Some objects cannot be cloned and the original value is returned instead.

Example:
```js
const object = $state({ property: 'this is cloneable', window })
const snapshot = $state.snapshot(object);
// property is cloned, but window (DOM element) is not cloneable
```

Properties that cannot be cloned are listed in the warning message.

