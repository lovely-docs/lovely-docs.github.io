
## Directories

### error_&_warning_reference
Complete reference of all Svelte compiler and runtime error and warning codes with explanations and solutions.

## Error & Warning Reference

Comprehensive reference for all Svelte compiler and runtime errors and warnings.

### Client-Side Errors
**Reactivity & State**
- `async_derived_orphan`: Async deriveds require effect context
- `derived_references_self`: Derived values cannot reference themselves
- `state_unsafe_mutation`: Cannot update state in `$derived`, `$inspect`, or template expressions; use `$effect`
- `state_descriptors_fixed`: Property descriptors on `$state` objects must have `value` and be `enumerable`, `configurable`, `writable`
- `effect_update_depth_exceeded`: Effect reads and writes same state causing infinite loop; use `untrack()` if necessary

**Effects**
- `effect_orphan`: Runes like `$effect` only work inside component initialization or other effects
- `effect_in_teardown`: Cannot use runes inside effect cleanup functions
- `effect_pending_outside_reaction`: `$effect.pending()` only works inside effects or deriveds
- `flush_sync_in_effect`: Cannot call `flushSync()` inside an effect

**Binding**
- `bind_invalid_checkbox_value`: Use `bind:checked` instead of `bind:value` for checkboxes
- `bind_not_bindable`: Mark properties as bindable: `let { key = $bindable() } = $props()`
- `props_rest_readonly`: Rest element properties from `$props()` are readonly

**Components & Lifecycle**
- `component_api_invalid_new`: Cannot instantiate components with `new` in Svelte 5; set `compatibility.componentApi: 4` for legacy support
- `set_context_after_init`: `setContext` must be called during component initialization, not in effects or after `await`
- `lifecycle_legacy_only`: Legacy lifecycle functions cannot be used in runes mode

**Other**
- `each_key_duplicate`: Keyed each blocks have duplicate keys
- `invalid_snippet`: Cannot render null/undefined snippet; use optional chaining `{@render snippet?.()}`
- `svelte_boundary_reset_onerror`: `<svelte:boundary>` reset function cannot be called synchronously in onerror; use `await tick()` first
- `hydration_failed`: Application hydration failed

### Client-Side Warnings
- `assignment_value_stale`: Nullish coalescing assignment (`??=`) evaluates to right-hand side, not assigned property; separate into two statements
- `await_reactivity_loss`: State read in async functions after `await` may not be tracked; pass values as parameters
- `await_waterfall`: Multiple async deriveds create unnecessary waterfalls; create promises first, then await them
- `console_log_state`: Logging `$state` proxies shows proxy object; use `$inspect()` or `$state.snapshot()` instead
- `hydration_mismatch`: Server-rendered HTML structure doesn't match client-rendered structure
- `state_proxy_equality_mismatch`: `$state()` creates proxies with different identity; compare values created the same way or use `$state.raw()`
- `transition_slide_display`: `slide` transition doesn't work with `display: inline`, `table`, or `contents`

### Compiler Errors

**Animation**
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element using `animate:` must be only child of keyed `{#each}` block
- `animation_missing_key`: Element using `animate:` must be in keyed `{#each}` block

**Attributes**
- `attribute_contenteditable_dynamic`: `contenteditable` cannot be dynamic with two-way binding
- `attribute_duplicate`: Attributes must be unique
- `attribute_invalid_event_handler`: Event attributes must be JavaScript expressions, not strings
- `attribute_invalid_type`: `type` attribute must be static if input uses two-way binding
- `attribute_invalid_multiple`: `multiple` attribute must be static if select uses two-way binding

**Binding**
- `bind_invalid_expression`: Can only bind to Identifier, MemberExpression, or `{get, set}` pair
- `bind_invalid_target`: `bind:%name%` can only be used with specific elements
- `bind_invalid_value`: Can only bind to state or props
- `bind_group_invalid_expression`: `bind:group` can only bind to Identifier or MemberExpression

**Blocks**
- `block_duplicate_clause`: Block clause cannot appear more than once
- `block_unclosed`: Block was left open
- `block_invalid_placement`: `{#%name%}` block cannot be at this location

**Const Tag**
- `const_tag_cycle`: Cyclical dependency detected
- `const_tag_invalid_placement`: `{@const}` must be immediate child of specific blocks/components
- `const_tag_invalid_reference`: Const declaration not available in this snippet

**Declarations**
- `declaration_duplicate`: Variable already declared
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant

**CSS**
- `css_empty_declaration`: Declaration cannot be empty
- `css_global_block_invalid_combinator`: `:global` selector cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {}` can only contain rules, not declarations
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only in rules or first in lone `:global(...)`

**Derived/Export**
- `derived_invalid_export`: Cannot export derived state from module; export function returning value instead
- `state_invalid_export`: Cannot export state from module if reassigned; export function or only mutate properties

**Each Block**
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array/index instead
- `each_key_without_as`: `{#each}` block without `as` clause cannot have key

**Effect**
- `effect_invalid_placement`: `$effect()` can only be used as expression statement

**Event Handler**
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Modifiers cannot be used together

**Props**
- `props_duplicate`: Cannot use `%rune%()` more than once
- `props_invalid_identifier`: `$props()` only with object destructuring pattern
- `props_invalid_pattern`: `$props()` assignment must not contain nested properties or computed keys
- `props_invalid_placement`: `$props()` only at top level as variable declaration initializer

**Rune**
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_name`: Not a valid rune
- `rune_missing_parentheses`: Cannot use rune without parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name

**Snippet**
- `snippet_conflict`: Cannot use `<slot>` and `{@render}` tags in same component
- `snippet_invalid_export`: Exported snippet can only reference things in `<script module>` or other exportable snippets
- `snippet_invalid_rest_parameter`: Snippets don't support rest parameters; use array instead
- `snippet_parameter_assignment`: Cannot reassign/bind to snippet parameter
- `snippet_shadowing_prop`: Snippet shadows prop with same name

**State**
- `state_field_duplicate`: State field already declared on class
- `state_invalid_placement`: `%rune%()` only as variable declaration initializer, class field declaration, or first assignment in constructor

**Svelte Meta Elements**
- `svelte_boundary_invalid_attribute`: Valid attributes on `<svelte:boundary>` are `onerror` and `failed`
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute with value
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_meta_invalid_placement`: `<%name%>` tags cannot be inside elements or blocks

**Svelte Options**
- `svelte_options_invalid_customelement`: "customElement" must be string literal or object with tag/shadow/props
- `svelte_options_invalid_customelement_shadow`: "shadow" must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name is reserved

**Textarea**
- `textarea_invalid_content`: `<textarea>` can have value attribute OR child content, not both

**Transition**
- `transition_conflict`: Cannot use `%type%:` with existing `%existing%:` directive
- `transition_duplicate`: Cannot use multiple `%type%:` directives on single element

**Parsing**
- `js_parse_error`: JavaScript parsing error
- `unexpected_eof`: Unexpected end of input
- `unterminated_string_constant`: Unterminated string

### Compiler Warnings

**Accessibility (a11y_*)**
- `a11y_accesskey`: Avoid `accesskey` attributes
- `a11y_aria_activedescendant_has_tabindex`: Elements with `aria-activedescendant` must have `tabindex`
- `a11y_autofocus`: Avoid `autofocus`
- `a11y_click_events_have_key_events`: Non-interactive elements with `onclick` need keyboard handlers and `tabindex`
- `a11y_consider_explicit_label`: Buttons/links need text or `aria-label`/`aria-labelledby`/`title`
- `a11y_distracting_elements`: Avoid `<marquee>` and `<blink>`
- `a11y_hidden`: Don't hide elements useful for screen reader navigation
- `a11y_img_redundant_alt`: Alt text shouldn't contain "image", "picture", or "photo"
- `a11y_interactive_supports_focus`: Interactive roles need `tabindex`
- `a11y_invalid_attribute`: Attributes like `href` must have valid values
- `a11y_label_has_associated_control`: Labels must wrap a control or use `for` attribute
- `a11y_media_has_caption`: `<video>` needs `<track kind="captions">` unless `muted`
- `a11y_missing_attribute`: Required attributes for `<a>`, `<area>`, `<html>`, `<iframe>`, `<img>`, `<object>`, `<input type="image">`
- `a11y_missing_content`: Headings and anchors must have text content
- `a11y_mouse_events_have_key_events`: `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`
- `a11y_no_abstract_role`: Abstract ARIA roles forbidden
- `a11y_no_interactive_element_to_noninteractive_role`: Can't use non-interactive roles on interactive elements
- `a11y_no_noninteractive_element_interactions`: Non-interactive elements shouldn't have event listeners
- `a11y_no_noninteractive_element_to_interactive_role`: Can't use interactive roles on non-interactive elements
- `a11y_no_noninteractive_tabindex`: Non-interactive elements shouldn't have non-negative `tabindex`
- `a11y_no_redundant_roles`: Don't repeat default ARIA roles
- `a11y_no_static_element_interactions`: `<div>` with event handlers needs ARIA role
- `a11y_positive_tabindex`: Avoid `tabindex > 0`
- `a11y_role_has_required_aria_props`: ARIA roles need required attributes
- `a11y_role_supports_aria_props`: Only use ARIA attributes supported by the element's role
- `a11y_unknown_aria_attribute`: Only valid ARIA attributes allowed
- `a11y_unknown_role`: Only valid, non-abstract ARIA roles allowed

**Code Quality**
- `bind_invalid_each_rest`: Rest operator in `{#each}` creates new object, breaking bindings
- `block_empty`: Empty blocks detected
- `component_name_lowercase`: Components must start with capital letter
- `css_unused_selector`: Unused CSS selectors; use `:global` to preserve selectors targeting `{@html}` or child components
- `element_implicitly_closed`: Some HTML elements auto-close others; add explicit closing tags
- `element_invalid_self_closing_tag`: HTML has no self-closing tags; use `<div>...</div>` not `<div />`
- `export_let_unused`: Unused export properties; use `export const` for external-only references
- `legacy_code`: Outdated syntax; use suggested replacement
- `legacy_component_creation`: Svelte 5 components aren't classes; use `mount()` or `hydrate()` from 'svelte'
- `non_reactive_update`: Variables reassigned but not declared with `$state()` won't trigger updates
- `perf_avoid_inline_class`: Declare classes at top level, not inline
- `perf_avoid_nested_class`: Don't declare classes in nested scopes
- `state_referenced_locally`: Reassigned state loses reactivity when passed to functions; wrap in function for lazy evaluation
- `store_rune_conflict`: Local binding conflicts with `$` store prefix; rename to avoid ambiguity
- `svelte_component_deprecated`: `<svelte:component>` deprecated; components are dynamic by default in Svelte 5
- `svelte_self_deprecated`: Use self-imports instead of `<svelte:self>`

**Deprecated Options**
- `options_deprecated_accessors`: `accessors` option deprecated in runes mode
- `options_deprecated_immutable`: `immutable` option deprecated in runes mode
- `options_removed_*`: Removed options: `enableSourcemap`, `hydratable`, `loopGuardTimeout`
- `options_renamed_ssr_dom`: `generate: "dom"` → `"client"`, `generate: "ssr"` → `"server"`

**Other**
- `attribute_avoid_is`: Don't use `is` attribute
- `attribute_quoted`: Quoted attributes on components will stringify in future versions
- `event_directive_deprecated`: Use `on%name%` attribute instead of `on:%name%` directive
- `slot_element_deprecated`: Use `{@render}` instead of `<slot>`

### Server-Side Errors
- `await_invalid`: Encountered asynchronous work while rendering synchronously; await the result of `render(...)` or wrap in `<svelte:boundary>`
- `html_deprecated`: The `html` property of server render results is deprecated; use `body` instead
- `lifecycle_function_unavailable`: Lifecycle methods like `mount` cannot be invoked in server context

### Shared Errors
- `invalid_default_snippet`: Cannot use `{@render children(...)}` if parent uses `let:` directives; use named snippets instead
- `invalid_snippet_arguments`: Snippets must be instantiated via `{@render ...}`, not called directly
- `lifecycle_outside_component`: Lifecycle methods like `onMount()` can only be called at top level of component instance scripts
- `missing_context`: The `get` function from `createContext()` throws if `set` was never called in a parent component
- `snippet_without_render_tag`: Snippets must be rendered with `{@render snippet()}`, not `{snippet}`
- `store_invalid_shape`: A store must have a `subscribe` method
- `svelte_element_invalid_this_value`: The `this` prop on `<svelte:element>` must be a string if defined

### Shared Warnings
- `dynamic_void_element_content`: Void elements like `<input>` cannot have content; children passed to `<svelte:element this="%tag%">` with void element will be ignored
- `state_snapshot_uncloneable`: `$state.snapshot()` cannot clone certain objects like DOM elements; original value is returned instead



## Pages

### svelte
Complete reference of Svelte 5 runtime API including component mounting, lifecycle hooks, state management, context, and utility functions.

## Svelte 5 API

**Mounting**: `mount(component, options)`, `hydrate()`, `unmount()`

**Lifecycle**: `onMount()`, `onDestroy()` (use `$effect` for `beforeUpdate`/`afterUpdate`)

**State**: `tick()`, `settled()`, `flushSync()`, `untrack()`

**Context**: `setContext()`, `getContext()`, `createContext()` (type-safe), `getAllContexts()`, `hasContext()`

**Events**: `createEventDispatcher()` (deprecated, use callback props)

**Advanced**: `fork()` for speculative state changes, `getAbortSignal()` for fetch cancellation, `createRawSnippet()`

**Types**: `Component<Props, Exports>`, `ComponentProps<Comp>`, `Snippet<Parameters>`, `MountOptions`

### svelte_action
TypeScript interfaces for typing Svelte actions and their return values with element types, parameters, and custom attributes/events.

Type actions using `Action<Element, Parameter, Attributes>` interface. Actions are functions called on element creation that can return `ActionReturn` with optional `update` and `destroy` methods. Example:

```ts
export const myAction: Action<HTMLDivElement, { prop: boolean } | undefined> = (node, param = { prop: true }) => {
	return {
		update: (p) => {...},
		destroy: () => {...}
	};
}
```

### svelte_animate
The flip animation function from svelte/animate calculates and animates element position changes between two DOMRect states.

## flip

Animates element position changes using the FLIP technique (First, Last, Invert, Play).

```js
import { flip } from 'svelte/animate';

flip(node, { from: DOMRect, to: DOMRect }, params?: FlipParams): AnimationConfig
```

**AnimationConfig**: `delay`, `duration`, `easing`, `css`, `tick`

**FlipParams**: `delay`, `duration` (number or function), `easing`

### svelte_attachments
API for creating and converting attachments - functions that run when elements mount to the DOM.

## createAttachmentKey
Creates a symbol key for programmatic attachments on elements via object spreading.

## fromAction
Converts actions to attachments: `{@attach fromAction(foo, () => bar)}`

## Attachment
Function that runs on element mount, optionally returning a cleanup function for unmount.

### svelte_compiler_api_reference
Complete API reference for the svelte/compiler module with functions for compiling, parsing, and preprocessing Svelte components, including detailed TypeScript type definitions for compilation options and AST structures.

## Core Functions

- **compile(source, options)** - Converts `.svelte` to JavaScript module
- **compileModule(source, options)** - Compiles JavaScript with runes
- **parse(source, options)** - Returns component AST (modern or legacy format)
- **preprocess(source, preprocessor)** - Transforms component source via hooks
- **migrate(source, options)** - Auto-migrates code to runes/render tags
- **VERSION** - Current version string

## Key Options

`compile()` options: `name`, `customElement`, `generate` ('client'|'server'|false), `dev`, `css` ('injected'|'external'), `runes` (true|false|undefined), `namespace`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `hmr`, `modernAst`

## Preprocessors

`PreprocessorGroup` with `markup`, `script`, `style` preprocessors. Each receives `{content, attributes, markup, filename}` and returns `{code, map?, dependencies?, attributes?}`

## AST Types

`Root` contains `fragment`, `css`, `instance`, `module`, `comments`, `options`. Includes element types (Component, RegularElement, SvelteComponent, etc.), block types (EachBlock, IfBlock, AwaitBlock, KeyBlock, SnippetBlock), tag types (ExpressionTag, HtmlTag, ConstTag, DebugTag, RenderTag), and directive types (BindDirective, OnDirective, ClassDirective, StyleDirective, TransitionDirective, UseDirective, AnimateDirective, LetDirective)

## Result

`CompileResult`: `{js: {code, map}, css: {code, map, hasGlobal}|null, warnings: [], metadata: {runes}, ast}`

### easing_functions
Reference for all easing functions available in the svelte/easing module for controlling animation timing.

The `svelte/easing` module exports 32 easing functions for animations: `linear`, quadratic (`quadIn/Out/InOut`), cubic, quartic, quintic, sine, exponential, circular, back, bounce, and elastic variants. Each takes a normalized time value and returns an eased value.

Import: `import { cubicInOut } from 'svelte/easing';`

### svelte_events
Event handler utility that attaches listeners to DOM elements while maintaining correct execution order relative to declarative handlers.

## on()

Attaches event handlers to DOM elements and returns a removal function. Preserves correct handler order relative to declarative handlers (like `onclick` attributes).

```js
import { on } from 'svelte/events';
const unsubscribe = on(window, 'resize', handler);
unsubscribe(); // removes handler
```

### svelte_legacy
Deprecated migration utilities for converting Svelte 4 code patterns to Svelte 5, including component constructors, event modifiers, and event handling functions.

## svelte/legacy - Migration utilities

Deprecated functions for migrating Svelte 4 code to Svelte 5:

**Component migration:** `asClassComponent()`, `createClassComponent()`

**Event modifiers as functions:** `once()`, `preventDefault()`, `stopPropagation()`, `stopImmediatePropagation()`, `self()`, `trusted()`

**Event modifiers as actions:** `passive()`, `nonpassive()`

**Other:** `handlers()` (combine listeners), `createBubbler()` (event delegation), `run()` (immediate execution)

### motion
Motion animation utilities: Spring class for physics-based animation, Tween class for time-based animation, and prefersReducedMotion for accessibility.

## Spring & Tween Classes

Animate values smoothly:

```js
import { Spring, Tween } from 'svelte/motion';
const spring = new Spring(0);
const tween = new Tween(0);
spring.target = 100; // animates with spring physics
tween.target = 100;  // animates over fixed duration
```

**Spring**: Physics-based animation with `stiffness` and `damping`. Methods: `set(value, options)`, `Spring.of(fn)`.

**Tween**: Time-based animation with `duration` and `easing`. Methods: `set(value, options)`, `Tween.of(fn)`.

**prefersReducedMotion**: Media query for accessibility - disable animations when user prefers reduced motion.

Legacy: `spring()` and `tweened()` functions are deprecated.

### reactive_window_values
Reactive window property bindings that update automatically in reactive contexts without manual event listeners.

Reactive wrappers for window properties via `svelte/reactivity/window`. Each export has a `.current` property: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `screenLeft`, `screenTop`, `devicePixelRatio`, `online`. All are `undefined` on server.

```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current}</p>
```

### svelte-reactivity
Reactive wrappers for built-in JavaScript objects (Map, Set, Date, URL, URLSearchParams) and utilities for integrating external event systems with Svelte's reactivity.

## Reactive Built-ins

- **SvelteMap, SvelteSet, SvelteDate, SvelteURL, SvelteURLSearchParams**: Reactive versions of standard objects. Reading their contents in effects/derived triggers re-evaluation. Values are not deeply reactive.
- **MediaQuery** (5.7.0+): Reactive media query with `current` property. Prefer CSS media queries to avoid hydration issues.

## createSubscriber

Integrates external event systems with Svelte reactivity. Accepts a `start` callback that receives an `update` function to trigger effect re-runs. Returns a cleanup function when the effect is destroyed. Multiple effects share one `start` call.

```js
const subscribe = createSubscriber((update) => {
	const off = on(element, 'event', update);
	return () => off();
});
```

### svelte_server
API for server-side rendering of Svelte components with the render function.

## render

Server-side function to render Svelte components to HTML strings.

```js
import { render } from 'svelte/server';
const { body, head } = render(Component, { props: {...}, context: new Map() });
```

Returns object with `body` and `head` properties. Options include `props`, `context`, and `idPrefix`.

### svelte_store
API reference for Svelte's reactive store system with writable, readable, and derived stores.

## Core Store Functions

- **writable(initial)** - Read/write store with `.set()` and `.update()`
- **readable(initial, start)** - Read-only store with optional lifecycle callback
- **derived(sources, fn)** - Computed store from one or more sources
- **get(store)** - Get current value synchronously
- **readonly(store)** - Make a store read-only
- **fromStore(store)** - Convert store to reactive `.current` property
- **toStore(get, set?)** - Convert getter/setter to store

All stores use `.subscribe(callback)` to listen for changes. Subscribers return an unsubscribe function.

### svelte_transition
Built-in transition functions for animating element entry and exit in Svelte.

## Transition Functions

Seven built-in transitions for animating element entry/exit:
- **blur**, **fade**, **fly**, **scale**, **slide**, **draw** (SVG), **crossfade** (paired morphing)

Common parameters: `delay`, `duration`, `easing`. Specific ones: `amount`/`opacity` (blur), `x`/`y`/`opacity` (fly), `start`/`opacity` (scale), `axis` (slide), `speed` (draw).

Import: `import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition'`

### compiler_errors_reference
Complete reference of all Svelte compiler error codes with descriptions and explanations for each error type.

## Compiler Errors Reference

Comprehensive list of Svelte compiler error codes organized by category:

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_duplicate`, `attribute_invalid_event_handler`, `attribute_invalid_type`, `attribute_unquoted_sequence`

**Bindings**: `bind_group_invalid_expression`, `bind_invalid_expression`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_close`

**CSS**: `css_empty_declaration`, `css_global_block_invalid_list`, `css_selector_invalid`

**Const Tags**: `const_tag_cycle`, `const_tag_invalid_expression`, `const_tag_invalid_placement`

**State**: `state_field_duplicate`, `state_invalid_export`, `state_invalid_placement`

**Directives**: `directive_invalid_value`, `event_handler_invalid_modifier`, `style_directive_invalid_modifier`

**Elements**: `element_unclosed`, `element_invalid_closing_tag`, `textarea_invalid_content`, `void_element_invalid_content`

**Exports**: `export_undefined`, `derived_invalid_export`, `module_illegal_default_export`

**Props/Runes**: `props_invalid_placement`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_renamed`

**Snippets**: `snippet_invalid_export`, `snippet_parameter_assignment`, `render_tag_invalid_expression`

**Slots**: `slot_attribute_invalid`, `slot_default_duplicate`, `slot_snippet_conflict`

**Svelte Tags**: `svelte_component_missing_this`, `svelte_element_missing_this`, `svelte_fragment_invalid_placement`, `svelte_options_invalid_customelement`

**Scripts**: `script_duplicate`, `style_duplicate`

**Stores**: `store_invalid_subscription`, `store_invalid_subscription_module`

**Other**: `dollar_binding_invalid`, `effect_invalid_placement`, `experimental_async`, `import_svelte_internal_forbidden`, `legacy_await_invalid`, `legacy_export_invalid`, `typescript_invalid_feature`, `unexpected_eof`

### compiler_warnings
Reference of all Svelte compiler warnings with codes, descriptions, and how to suppress them using `<!-- svelte-ignore -->` comments.

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

### runtime_errors
Reference documentation for all runtime errors in Svelte with explanations and solutions.

## Client Errors
- **async_derived_orphan**: Async deriveds must be created inside effects
- **bind_invalid_checkbox_value**: Use `bind:checked` not `bind:value` for checkboxes
- **bind_invalid_export**: Use `bind:this` then access property, not `bind:key`
- **bind_not_bindable**: Mark properties bindable with `let { key = $bindable() } = $props()`
- **component_api_changed/invalid_new**: Components are no longer classes in Svelte 5
- **derived_references_self**: Deriveds cannot reference themselves
- **each_key_duplicate**: Keyed each blocks need unique keys
- **effect_update_depth_exceeded**: Effect reads and writes same state. Use `untrack()` if necessary: `$effect(() => { count += 1; })`
- **invalid_snippet**: Use optional chaining: `{@render snippet?.()}`
- **state_unsafe_mutation**: Cannot update state in `$derived(...)`. Make everything derived instead
- **svelte_boundary_reset_onerror**: Use `await tick()` before calling reset in onerror

## Server Errors
- **await_invalid**: Async work in sync render. Await render or use `<svelte:boundary>` with pending snippet
- **html_deprecated**: Use `body` instead of `html` property

## Shared Errors
- **invalid_default_snippet**: Cannot use `{@render children(...)}` with `let:` directives
- **lifecycle_outside_component**: Lifecycle methods only work at top level of instance script
- **missing_context**: Context not set in parent component
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`

### runtime_warnings
Reference guide for Svelte runtime warnings with explanations and fixes for common issues with state, reactivity, hydration, and component lifecycle.

## Client Warnings

- **assignment_value_stale**: `??=` evaluates to RHS, not assigned property. Separate statements.
- **await_reactivity_loss**: State after `await` not tracked. Pass as function parameters.
- **await_waterfall**: Create promises first, then await them.
- **console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging proxies.
- **hydration_attribute_changed/hydration_html_changed**: Server/client values must match; won't update during hydration.
- **ownership_invalid_mutation**: Use `bind:` or `$bindable` instead of mutating unbound props.
- **state_proxy_equality_mismatch**: `$state()` proxies have different identity: `value === $state(value)` is false.
- **state_proxy_unmount**: Don't pass `$state` proxies to `unmount()`.
- **transition_slide_display**: `slide` requires `display: block/flex/grid`.

## Shared Warnings

- **state_snapshot_uncloneable**: `$state.snapshot()` can't clone DOM elements, returns original.

