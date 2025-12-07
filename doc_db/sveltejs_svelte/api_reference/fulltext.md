
## Directories

### error_&_warning_reference
Complete reference of all Svelte runtime errors, compiler errors, compiler warnings, and server-side errors with causes and solutions.

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



## Pages

### svelte_api_reference
Svelte 5 public API: Component type, mount/hydrate/unmount functions, lifecycle hooks (onMount/onDestroy), context API (createContext/getContext/setContext), event dispatcher, state sync (tick/settled/flushSync), fork for speculative updates, untrack/getAbortSignal utilities, and TypeScript types.

## Core Components and Types

**SvelteComponent** - Base class for Svelte 4 components (deprecated in Svelte 5+). Use `Component` type and `mount()` function instead. Had methods like `$destroy()`, `$on()`, `$set()` which are now deprecated.

**SvelteComponentTyped** - Typed variant of SvelteComponent (deprecated, use `Component` instead).

**Component** - Type for creating strongly typed Svelte components. Example:
```ts
import type { Component } from 'svelte';
export declare const MyComponent: Component<{ foo: string }> {}
```
Can be used in TypeScript to provide intellisense and type checking when using components.

## Lifecycle Functions

**onMount** - Runs once after component mounts to DOM. Can return cleanup function. Doesn't run during SSR.
```ts
onMount(() => {
  console.log('mounted');
  return () => console.log('cleanup');
});
```

**onDestroy** - Runs before component unmounts. Only lifecycle that runs in SSR.

**beforeUpdate** (deprecated, use `$effect.pre`) - Runs before component updates after state changes.

**afterUpdate** (deprecated, use `$effect`) - Runs after component updates.

## Context API

**createContext** - Type-safe context pair (available since 5.40.0):
```ts
const [getTheme, setTheme] = createContext<string>();
// In parent: setTheme('dark')
// In child: const theme = getTheme()
```

**getContext** - Retrieves context by key from parent component.

**setContext** - Associates context object with key for children to access.

**getAllContexts** - Gets entire context map from closest parent.

**hasContext** - Checks if key exists in parent context.

## Event Handling

**createEventDispatcher** (deprecated, use callback props or `$host()`) - Creates typed event dispatcher:
```ts
const dispatch = createEventDispatcher<{
  loaded: null;
  change: string;
  optional: number | null;
}>();
dispatch('change', 'value');
```

## Component Mounting

**mount** - Mounts component to target, returns exports:
```ts
import { mount } from 'svelte';
import App from './App.svelte';
const app = mount(App, { target: document.body, props: { foo: 'bar' } });
```

**hydrate** - Hydrates component on given target with SSR-rendered HTML.

**unmount** - Unmounts component, optionally plays outro transitions:
```ts
unmount(app, { outro: true });
```

## State and Synchronization

**tick** - Returns promise that resolves after pending state changes applied to DOM.

**settled** - Returns promise that resolves after state changes and async work complete (available since 5.36).

**flushSync** - Synchronously flushes pending updates, optionally runs callback:
```ts
flushSync(() => { /* updates applied immediately */ });
```

**fork** - Creates off-screen fork for speculative state changes (available since 5.42):
```ts
const fork = fork(() => { state.value = 'new'; });
// Later: fork.commit() or fork.discard()
```

## Utilities

**untrack** - Prevents state reads inside function from being treated as dependencies:
```ts
$effect(() => {
  save(data, { timestamp: untrack(() => time) });
});
```

**getAbortSignal** - Returns AbortSignal that aborts when derived/effect re-runs or destroys:
```ts
const data = $derived(await fetch('/items', { signal: getAbortSignal() }));
```

**createRawSnippet** - Creates snippet programmatically with render and optional setup functions.

## Types

**ComponentProps** - Extracts props type from component:
```ts
const props: ComponentProps<typeof MyComponent> = { foo: 'bar' };
```

**ComponentConstructorOptions** (deprecated) - Options for old class-based component constructor.

**ComponentEvents** (deprecated) - Extracts events type from SvelteComponent.

**ComponentType** (deprecated) - Type for class-based components.

**EventDispatcher** - Interface for event dispatcher with typed dispatch method.

**Fork** - Interface with `commit()` and `discard()` methods.

**MountOptions** - Options for mount function: target, anchor, events, context, intro.

**Snippet** - Type for snippet blocks with typed parameters.

**ComponentInternals** - Internal implementation details (branded type).

### svelte-action
Action and ActionReturn TypeScript interfaces for typing element lifecycle functions with optional update/destroy callbacks and custom attributes/events.

## Action

Actions are functions called when an element is created. Type them with the `Action` interface:

```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {
	// ...
}
```

`Action<HTMLDivElement>` and `Action<HTMLDivElement, undefined>` both mean the action accepts no parameters.

Actions can return an object with optional `update` and `destroy` methods, and can specify additional attributes/events via the `Attributes` type parameter.

## ActionReturn

Actions can return an object with two optional properties:
- `update(parameter)`: Called whenever the action's parameter changes, after Svelte updates the markup
- `destroy()`: Called after the element is unmounted

You can specify additional attributes and events the action enables:

```ts
interface Attributes {
	newprop?: string;
	'on:event': (e: CustomEvent<boolean>) => void;
}

export function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes> {
	return {
		update: (updatedParameter) => {...},
		destroy: () => {...}
	};
}
```

Note: Actions have been superseded by attachments.

### svelte-animate
flip animation function using FLIP technique to animate element position changes between DOMRect start/end states with configurable delay, duration, and easing

## flip

The `flip` function animates element position changes using the FLIP technique (First, Last, Invert, Play). It calculates start and end positions of an element and animates between them by translating x and y values.

```js
import { flip } from 'svelte/animate';

function flip(
  node: Element,
  { from, to }: { from: DOMRect; to: DOMRect },
  params?: FlipParams
): AnimationConfig;
```

## AnimationConfig

Configuration object returned by animation functions with properties:
- `delay?: number` - delay before animation starts
- `duration?: number` - animation duration in milliseconds
- `easing?: (t: number) => number` - easing function
- `css?: (t: number, u: number) => string` - returns CSS to apply at each frame
- `tick?: (t: number, u: number) => void` - callback invoked at each frame

## FlipParams

Parameters for the `flip` function:
- `delay?: number` - delay before animation starts
- `duration?: number | ((len: number) => number)` - duration in ms or function that calculates it from distance
- `easing?: (t: number) => number` - easing function

### attachments
API for creating and converting attachments: createAttachmentKey() returns symbol for spreading attachments onto elements; fromAction() converts actions to attachments; Attachment is a mount/unmount lifecycle function.

## createAttachmentKey

Creates a symbol key for programmatic attachment creation. When spread onto an element, the symbol key is recognized as an attachment—an alternative to `{@attach ...}` syntax.

```js
import { createAttachmentKey } from 'svelte/attachments';

const props = {
  class: 'cool',
  onclick: () => alert('clicked'),
  [createAttachmentKey()]: (node) => {
    node.textContent = 'attached!';
  }
};
```

```dts
function createAttachmentKey(): symbol;
```

## fromAction

Converts an action into an attachment with identical behavior. The second argument must be a function that returns the action's argument, not the argument itself.

```js
import { fromAction } from 'svelte/attachments';

// with an action
<div use:foo={bar}>...</div>

// with an attachment
<div {@attach fromAction(foo, () => bar)}>...</div>
```

```dts
function fromAction<E extends EventTarget, T extends unknown>(
  action: Action<E, T> | ((element: E, arg: T) => void | ActionReturn<T>),
  fn: () => T
): Attachment<E>;

function fromAction<E extends EventTarget>(
  action: Action<E, void> | ((element: E) => void | ActionReturn<void>)
): Attachment<E>;
```

## Attachment

A function that runs when an element mounts to the DOM and optionally returns a cleanup function called on unmount. Can be attached via `{@attach ...}` or by spreading an object with a property created by `createAttachmentKey`.

```dts
interface Attachment<T extends EventTarget = Element> {
  (element: T): void | (() => void);
}
```

### svelte-compiler
Svelte compiler API: compile/compileModule/parse/preprocess/migrate functions with CompileOptions (name, customElement, css, runes, etc.), ModuleCompileOptions (dev, generate, filename), CompileResult (js/css/warnings/metadata/ast), PreprocessorGroup/Preprocessor/Processed types, and comprehensive AST type definitions.

## Compiler API

The `svelte/compiler` module exports functions for programmatically compiling Svelte components and modules.

### Core Functions

**VERSION**: Current version string from package.json.

**compile(source, options)**: Converts `.svelte` source code into a JavaScript module exporting a component. Returns `CompileResult` with `js`, `css`, `warnings`, `metadata`, and `ast` properties.

**compileModule(source, options)**: Compiles JavaScript source containing runes into a JavaScript module. Returns `CompileResult`.

**parse(source, options)**: Parses a component and returns its AST. With `modern: true` returns modern AST format; without or `modern: false` returns legacy AST. Options include `filename` and `loose`.

**preprocess(source, preprocessor, options)**: Applies preprocessor hooks to transform component source code (e.g., converting `<style lang="sass">` to vanilla CSS). Accepts single or array of `PreprocessorGroup`. Returns `Promise<Processed>`.

**migrate(source, options)**: Best-effort migration of Svelte code to use runes, event attributes, and render tags. May throw on complex code. Options: `filename`, `use_ts`. Returns `{ code: string }`.

**walk()**: Deprecated—use `import { walk } from 'estree-walker'` instead.

### CompileOptions

Extends `ModuleCompileOptions` with:
- `name`: Component class name (inferred from filename if unspecified)
- `customElement`: Generate custom element constructor (default: false)
- `accessors`: Create getters/setters for props (default: false, deprecated in runes mode)
- `namespace`: Element namespace like "html", "svg", "mathml" (default: 'html')
- `immutable`: Promise not to mutate objects (default: false, deprecated in runes mode)
- `css`: 'injected' (in head/shadow root) or 'external' (returned in result, default: 'injected' for custom elements)
- `cssHash`: Function returning scoped CSS classname (default: `svelte-${hash(filename ?? css)}`)
- `preserveComments`: Keep HTML comments (default: false)
- `preserveWhitespace`: Keep whitespace as-is (default: false)
- `fragments`: 'html' (faster, uses template innerHTML) or 'tree' (slower, CSP-compatible, default: 'html')
- `runes`: true/false/undefined to force/disable/infer runes mode (default: undefined, will be true in Svelte 6)
- `discloseVersion`: Expose Svelte version in `window.__svelte.v` (default: true)
- `compatibility.componentApi`: 4 or 5 for Svelte 4 compatibility (default: 5)
- `sourcemap`: Initial sourcemap to merge
- `outputFilename`: For JavaScript sourcemap
- `cssOutputFilename`: For CSS sourcemap
- `hmr`: Enable hot reloading (default: false)
- `modernAst`: Return modern AST version (default: false, will be true in Svelte 6)

### ModuleCompileOptions

- `dev`: Add runtime checks and debugging (default: false)
- `generate`: 'client' (browser), 'server' (SSR), or false (no output, default: 'client')
- `filename`: For debugging and sourcemaps
- `rootDir`: Prevent filesystem info leakage (default: process.cwd())
- `warningFilter`: Function to filter warnings (return true to keep)
- `experimental.async`: Allow `await` in deriveds, template expressions, and component top level (v5.36+)

### CompileResult

- `js`: `{ code: string; map: SourceMap }`
- `css`: `null | { code: string; map: SourceMap; hasGlobal: boolean }`
- `warnings`: Array of warning objects with `code`, `message`, `start`, `end` properties
- `metadata`: `{ runes: boolean }` (true if compiled in runes mode)
- `ast`: The component AST

### Preprocessors

**PreprocessorGroup**: Object with optional `name`, `markup`, `style`, `script` properties.

**MarkupPreprocessor**: `(options: { content: string; filename?: string }) => Processed | void | Promise<Processed | void>`

**Preprocessor** (script/style): `(options: { content: string; attributes: Record<string, string | boolean>; markup: string; filename?: string }) => Processed | void | Promise<Processed | void>`

**Processed**: Result object with:
- `code`: The transformed code
- `map`: Optional source map
- `dependencies`: Optional list of files to watch
- `attributes`: Optional updated tag attributes (script/style only)
- `toString`: Optional string representation

### AST Types

The `AST` namespace contains comprehensive type definitions for the component AST, including:
- `Root`: Top-level node with `options`, `fragment`, `css`, `instance`, `module`, `comments`
- `Fragment`: Container with array of nodes
- `Text`, `ExpressionTag`, `HtmlTag`, `Comment`, `ConstTag`, `DebugTag`, `RenderTag`, `AttachTag`
- Element types: `Component`, `RegularElement`, `TitleElement`, `SlotElement`, `SvelteBody`, `SvelteComponent`, `SvelteDocument`, `SvelteElement`, `SvelteFragment`, `SvelteBoundary`, `SvelteHead`, `SvelteSelf`, `SvelteWindow`
- Block types: `EachBlock`, `IfBlock`, `AwaitBlock`, `KeyBlock`, `SnippetBlock`
- Directive types: `AnimateDirective`, `BindDirective`, `ClassDirective`, `LetDirective`, `OnDirective`, `StyleDirective`, `TransitionDirective`, `UseDirective`
- `Attribute`, `SpreadAttribute`, `Script`, `JSComment`

### Errors and Warnings

**CompileError**: Extends `ICompileDiagnostic`
**Warning**: Extends `ICompileDiagnostic`

### easing
32 easing functions (linear, quad/cubic/quart/quint/sine/expo/circ/back/bounce/elastic with In/Out/InOut variants) for controlling animation timing curves.

The `svelte/easing` module provides 32 easing functions for animations and transitions. Each function takes a normalized time value `t` (typically 0 to 1) and returns an eased value.

Available easing functions:
- **Linear**: `linear` - constant rate
- **Quadratic**: `quadIn`, `quadOut`, `quadInOut`
- **Cubic**: `cubicIn`, `cubicOut`, `cubicInOut`
- **Quartic**: `quartIn`, `quartOut`, `quartInOut`
- **Quintic**: `quintIn`, `quintOut`, `quintInOut`
- **Sine**: `sineIn`, `sineOut`, `sineInOut`
- **Exponential**: `expoIn`, `expoOut`, `expoInOut`
- **Circular**: `circIn`, `circOut`, `circInOut`
- **Back**: `backIn`, `backOut`, `backInOut`
- **Bounce**: `bounceIn`, `bounceOut`, `bounceInOut`
- **Elastic**: `elasticIn`, `elasticOut`, `elasticInOut`

Each easing function follows the pattern: `In` (slow start), `Out` (slow end), `InOut` (slow start and end).

Import example:
```js
import { cubicIn, bounceOut, linear } from 'svelte/easing';
```

Use in animations/transitions by passing the easing function to control how values change over time.

### svelte-events
on() function attaches event listeners to DOM targets (window, document, HTMLElement, MediaQueryList, EventTarget) with proper ordering relative to declarative handlers, returns unsubscribe function.

## on

Attaches an event handler to DOM elements (window, document, HTMLElement, MediaQueryList, or generic EventTarget) and returns a function that removes the handler.

Unlike `addEventListener`, using `on()` preserves the correct handler execution order relative to declaratively-added handlers (like `onclick` attributes), which use event delegation for performance.

**Signature:**
```js
import { on } from 'svelte/events';

// Attach to window
on(window, 'click', (event) => { /* ... */ }, options);

// Attach to document
on(document, 'scroll', (event) => { /* ... */ }, options);

// Attach to element
on(element, 'input', (event) => { /* ... */ }, options);

// Attach to MediaQueryList
on(mediaQueryList, 'change', (event) => { /* ... */ }, options);

// Generic EventTarget
on(eventTarget, 'custom', (event) => { /* ... */ }, options);
```

All overloads return a function that removes the handler when called. The `handler` receives the target as `this` context and the event object. Optional `AddEventListenerOptions` can be passed for capture, once, passive, etc.

### svelte-legacy
Deprecated Svelte 4 compatibility layer: component constructors (asClassComponent, createClassComponent, createBubbler), event modifier replacements (once, preventDefault, stopPropagation, stopImmediatePropagation, self, trusted, passive, nonpassive), and utilities (handlers, run).

## Overview
The `svelte/legacy` module provides deprecated functions for migrating from Svelte 4 to Svelte 5. All imports are marked as deprecated and should be migrated away from over time.

## Component Migration Functions

**asClassComponent** - Converts a Svelte 5 component function to a Svelte 4 compatible component constructor:
```js
import { asClassComponent } from 'svelte/legacy';
const LegacyComponent = asClassComponent(MyComponent);
```

**createClassComponent** - Creates a Svelte 4 compatible component from options and a component function:
```js
import { createClassComponent } from 'svelte/legacy';
const component = createClassComponent({
  component: MyComponent,
  props: { /* ... */ }
});
```

**createBubbler** - Creates a `bubble` function that mimics Svelte 4's automatic event delegation:
```js
import { createBubbler } from 'svelte/legacy';
const bubble = createBubbler();
const clickHandler = bubble('click');
```

## Event Modifier Substitutes

Since Svelte 5 removed event modifiers, these functions provide replacements:

**once** - Executes handler only once:
```js
import { once } from 'svelte/legacy';
const handler = once((event) => { /* ... */ });
```

**preventDefault** - Calls `event.preventDefault()` before handler:
```js
import { preventDefault } from 'svelte/legacy';
const handler = preventDefault((event) => { /* ... */ });
```

**stopPropagation** - Calls `event.stopPropagation()` before handler:
```js
import { stopPropagation } from 'svelte/legacy';
const handler = stopPropagation((event) => { /* ... */ });
```

**stopImmediatePropagation** - Calls `event.stopImmediatePropagation()` before handler:
```js
import { stopImmediatePropagation } from 'svelte/legacy';
const handler = stopImmediatePropagation((event) => { /* ... */ });
```

**self** - Only executes if `event.target === node`:
```js
import { self } from 'svelte/legacy';
const handler = self((event) => { /* ... */ });
```

**trusted** - Only executes if `event.isTrusted === true`:
```js
import { trusted } from 'svelte/legacy';
const handler = trusted((event) => { /* ... */ });
```

## Event Modifier Actions

**passive** - Action to apply passive event listener:
```js
import { passive } from 'svelte/legacy';
<button use:passive={['click', handler]}>Click</button>
```

**nonpassive** - Action to apply non-passive event listener:
```js
import { nonpassive } from 'svelte/legacy';
<button use:nonpassive={['click', handler]}>Click</button>
```

## Utility Functions

**handlers** - Combines multiple event listeners into one:
```js
import { handlers } from 'svelte/legacy';
const combined = handlers(handler1, handler2, handler3);
```

**run** - Executes function immediately on server, works like `$effect.pre` on client:
```js
import { run } from 'svelte/legacy';
run(() => { /* initialization code */ });
```

## Types

**LegacyComponentType** - Type supporting dual class/function component usage during transition period.

### motion
Spring and Tween classes for physics-based and time-based value animation; prefersReducedMotion media query; deprecated spring/tweened store functions.

## Spring

A class wrapper for values that animate with spring physics. Available since 5.8.0.

```js
import { Spring } from 'svelte/motion';
const spring = new Spring(0);
spring.target = 100; // animates current towards target
```

Properties: `target` (end value), `current` (getter for current value), `stiffness`, `damping`, `precision`.

Methods:
- `constructor(value, options?)` - create spring
- `static of(fn, options?)` - bind spring to function return value (must be in effect root)
- `set(value, options?)` - set target and return promise when current catches up. Options: `instant` (jump immediately), `preserveMomentum` (continue trajectory for N ms, useful for fling gestures)

## Tween

A class wrapper for values that smoothly animate to target. Available since 5.8.0.

```js
import { Tween } from 'svelte/motion';
const tween = new Tween(0);
tween.target = 100; // animates current towards target over duration
```

Properties: `target` (getter/setter), `current` (getter).

Methods:
- `constructor(value, options?)` - create tween with delay, duration, easing options
- `static of(fn, options?)` - bind tween to function return value (must be in effect root)
- `set(value, options?)` - set target and return promise when current catches up. Options override defaults.

## prefersReducedMotion

A media query that matches user's prefers-reduced-motion setting (available since 5.7.0).

```js
import { prefersReducedMotion } from 'svelte/motion';
import { fly } from 'svelte/transition';

let visible = $state(false);
```

```svelte
{#if visible}
	<p transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}>
		flies in, unless user prefers reduced motion
	</p>
{/if}
```

## Legacy APIs (deprecated)

`spring(value?, opts?)` - function that returns Spring store (use Spring class instead)

`tweened(value?, defaults?)` - function that returns Tweened store (use Tween class instead)

Legacy Spring store interface extends Readable and has `set()`, `update()`, `subscribe()` methods plus `precision`, `damping`, `stiffness` properties.

Legacy Tweened store interface extends Readable and has `set()`, `update()` methods.

### reactive_window_values
Reactive window property accessors (innerWidth/Height, outerWidth/Height, scrollX/Y, screenLeft/Top, devicePixelRatio, online) via `.current` property; undefined on server; screenLeft/Top update via requestAnimationFrame.

## Overview
The `svelte/reactivity/window` module exports reactive versions of window and navigator properties. Each export has a reactive `current` property that updates automatically and can be used in templates, deriveds, and effects without manual event listeners.

## Available Exports (all since 5.11.0)

- **devicePixelRatio**: Reactive view of `window.devicePixelRatio` (undefined on server). Browser behavior varies: Chrome responds to zoom level, Firefox and Safari don't.
- **innerHeight**: Reactive view of `window.innerHeight` (undefined on server)
- **innerWidth**: Reactive view of `window.innerWidth` (undefined on server)
- **online**: Reactive view of `navigator.onLine` (undefined on server)
- **outerHeight**: Reactive view of `window.outerHeight` (undefined on server)
- **outerWidth**: Reactive view of `window.outerWidth` (undefined on server)
- **screenLeft**: Reactive view of `window.screenLeft`, updated in `requestAnimationFrame` callback (undefined on server)
- **screenTop**: Reactive view of `window.screenTop`, updated in `requestAnimationFrame` callback (undefined on server)
- **scrollX**: Reactive view of `window.scrollX` (undefined on server)
- **scrollY**: Reactive view of `window.scrollY` (undefined on server)

## Example
```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current}</p>
```

### svelte-reactivity
Reactive versions of Map, Set, Date, URL, URLSearchParams, MediaQuery; createSubscriber bridges external events to Svelte reactivity.

## Reactive Built-in Classes

Svelte provides reactive versions of JavaScript built-ins that trigger effects/derived when their contents change:

**MediaQuery** (5.7.0+): Wraps `matchMedia()` with a `current` property reflecting match state. Use CSS media queries when possible to avoid hydration mismatches.
```js
const large = new MediaQuery('min-width: 800px');
// large.current is true/false
```

**SvelteDate**: Reactive `Date` wrapper. Reading via methods like `getTime()`, `toString()`, or `Intl.DateTimeFormat` triggers reactivity.
```js
const date = new SvelteDate();
$effect(() => {
  const interval = setInterval(() => date.setTime(Date.now()), 1000);
  return () => clearInterval(interval);
});
// <p>The time is {formatter.format(date)}</p>
```

**SvelteMap**: Reactive `Map`. Reading via iteration, `size`, `get()`, or `has()` triggers reactivity. Values are not deeply reactive.
```js
let board = new SvelteMap();
let winner = $derived(result(board));
// <button onclick={() => board.set(i, player)}>{board.get(i)}</button>
```

**SvelteSet**: Reactive `Set`. Reading via iteration, `size`, or `has()` triggers reactivity. Values are not deeply reactive.
```js
let monkeys = new SvelteSet();
function toggle(monkey) {
  monkeys.has(monkey) ? monkeys.delete(monkey) : monkeys.add(monkey);
}
// {#if monkeys.has('🙈')}<p>see no evil</p>{/if}
```

**SvelteURL**: Reactive `URL` wrapper. Reading properties like `href`, `pathname`, `protocol`, `hostname` triggers reactivity. `searchParams` returns a `SvelteURLSearchParams`.
```js
const url = new SvelteURL('https://example.com/path');
// <input bind:value={url.protocol} />
// <input bind:value={url.href} />
```

**SvelteURLSearchParams**: Reactive `URLSearchParams`. Reading via iteration, `get()`, or `getAll()` triggers reactivity.
```js
const params = new SvelteURLSearchParams('message=hello');
// <button onclick={() => params.append(key, value)}>append</button>
// {#each params as [key, value]}<p>{key}: {value}</p>{/each}
```

## createSubscriber

(5.7.0+) Integrates external event-based systems with Svelte reactivity. When called in an effect, `start` receives an `update` function that re-runs the effect. If `start` returns a cleanup function, it's called when the effect destroys. Multiple effects share one `start` call; cleanup only runs when all effects are destroyed.

```js
import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';

export class MediaQuery {
  #query;
  #subscribe;

  constructor(query) {
    this.#query = window.matchMedia(`(${query})`);
    this.#subscribe = createSubscriber((update) => {
      const off = on(this.#query, 'change', update);
      return () => off();
    });
  }

  get current() {
    this.#subscribe();
    return this.#query.matches;
  }
}
```

### server-render
render() function for server-side Svelte component rendering, returns body and head HTML strings with optional props, context, and idPrefix configuration.

## render

Server-side only function for rendering Svelte components. Only available when compiling with the `server` option.

Takes a component and returns an object with `body` and `head` properties for populating HTML during server-rendering.

```js
import { render } from 'svelte/server';

const { body, head } = render(MyComponent, {
  props: { /* component props */ },
  context: new Map(),
  idPrefix: 'svelte-'
});
```

**Function signature:**
- `component`: A Svelte component (either SvelteComponent or Component type)
- `options` (optional if component has no required props):
  - `props`: Component props (excludes `$$slots` and `$$events`)
  - `context`: Optional Map for passing context values
  - `idPrefix`: Optional string prefix for generated IDs
- Returns: `RenderOutput` with `body` and `head` properties

### store
Reactive store API: readable/writable for state, derived for computed values, get for sync reads, readonly/fromStore/toStore for conversions; all stores use subscribe(callback) pattern.

## Store API Reference

The `svelte/store` module provides reactive state management through subscribable stores.

### Core Functions

**readable(value?, start?)** - Creates a read-only store. The optional `start` callback is invoked when the first subscriber subscribes and can return a cleanup function.

**writable(value?, start?)** - Creates a store with both read and write capabilities. Extends `Readable` with `set(value)` to update and inform subscribers, and `update(updater)` to transform the current value.

**derived(stores, fn, initial_value?)** - Creates a derived store from one or more source stores. The aggregation function `fn` receives current values and can either return a new value synchronously or use `set`/`update` callbacks for async operations. Returns a `Readable` store.

**get(store)** - Synchronously retrieves the current value from any store by subscribing and immediately unsubscribing.

**readonly(store)** - Wraps a store to expose only its readable interface, hiding write capabilities.

**fromStore(store)** - Converts a store to a reactive object with a `current` property. For `Writable` stores, `current` is mutable; for `Readable` stores, it's read-only.

**toStore(get, set?)** - Converts getter/setter functions into a store. With both parameters creates a `Writable`, with only `get` creates a `Readable`.

### Core Types

**Readable<T>** - Interface with `subscribe(run, invalidate?)` method. The `run` callback fires on value changes; `invalidate` is an optional cleanup callback.

**Writable<T>** - Extends `Readable<T>` with `set(value)` and `update(updater)` methods.

**Subscriber<T>** - Type for subscription callbacks: `(value: T) => void`

**Unsubscriber** - Type for unsubscribe functions: `() => void`

**Updater<T>** - Type for update callbacks: `(value: T) => T`

**StartStopNotifier<T>** - Type for store initialization callbacks: `(set, update) => void | (() => void)`. Called when first subscriber subscribes, can return cleanup function.

### svelte-transition
Built-in transition functions (blur, fade, fly, scale, slide, draw for SVG, crossfade for paired morphing) with configurable delay/duration/easing and custom css/tick callbacks.

## Transition Functions

Seven built-in transition functions for animating element entry/exit:

- **blur**: Animates blur filter and opacity. Parameters: `delay`, `duration`, `easing`, `amount` (number|string), `opacity` (number)
- **fade**: Animates opacity from 0 to current (in) or current to 0 (out). Parameters: `delay`, `duration`, `easing`
- **fly**: Animates x, y position and opacity. Parameters: `delay`, `duration`, `easing`, `x` (number|string), `y` (number|string), `opacity`
- **scale**: Animates opacity and scale. Parameters: `delay`, `duration`, `easing`, `start` (number), `opacity`
- **slide**: Slides element in/out. Parameters: `delay`, `duration`, `easing`, `axis` ('x'|'y')
- **draw**: Animates SVG stroke like drawing. Works with elements having `getTotalLength()` method. Parameters: `delay`, `speed`, `duration` (number|function), `easing`
- **crossfade**: Creates paired `send`/`receive` transitions that morph elements between positions with fade. Returns tuple of two functions. Parameters: `delay`, `duration` (number|function), `easing`, `fallback` (optional custom transition)

All functions return `TransitionConfig` with optional `delay`, `duration`, `easing`, `css` (function), `tick` (function).

Import: `import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition'`

### compiler-errors
Complete reference of 200+ Svelte compiler error codes with descriptions, organized by feature (animations, attributes, bindings, blocks, components, CSS, declarations, each blocks, elements, event handlers, exports, props, runes, scripts, slots, snippets, state, stores, svelte meta tags, transitions, legacy/async).

## Compiler Errors Reference

Complete list of Svelte compiler error codes with descriptions and explanations.

### Animation Errors
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element using `animate:` must be only child of keyed `{#each}` block
- `animation_missing_key`: Element using `animate:` must be in keyed `{#each}` block (forgot key?)

### Attribute Errors
- `attribute_contenteditable_dynamic`: `contenteditable` cannot be dynamic with two-way binding
- `attribute_contenteditable_missing`: `contenteditable` required for textContent/innerHTML/innerText bindings
- `attribute_duplicate`: Attributes must be unique
- `attribute_empty_shorthand`: Attribute shorthand cannot be empty
- `attribute_invalid_event_handler`: Event attribute must be JavaScript expression, not string
- `attribute_invalid_multiple`: `multiple` attribute must be static if select uses two-way binding
- `attribute_invalid_name`: Invalid attribute name
- `attribute_invalid_sequence_expression`: Sequence expressions not allowed as attribute/directive values in runes mode unless wrapped in parentheses
- `attribute_invalid_type`: `type` attribute must be static text if input uses two-way binding
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless value only contains expression

### Binding Errors
- `bind_group_invalid_expression`: `bind:group` can only bind to Identifier or MemberExpression
- `bind_group_invalid_snippet_parameter`: Cannot `bind:group` to snippet parameter
- `bind_invalid_expression`: Can only bind to Identifier, MemberExpression, or `{get, set}` pair
- `bind_invalid_name`: Invalid binding name
- `bind_invalid_parens`: `bind:%name%={get, set}` must not have surrounding parentheses
- `bind_invalid_target`: `bind:%name%` only valid with specific elements
- `bind_invalid_value`: Can only bind to state or props

### Block Errors
- `block_duplicate_clause`: Block clause cannot appear more than once
- `block_invalid_continuation_placement`: `{:...}` block invalid at position (unclosed element/block?)
- `block_invalid_elseif`: Use `else if` not `elseif`
- `block_invalid_placement`: `{#%name%}` block cannot be at this location
- `block_unclosed`: Block left open
- `block_unexpected_character`: Expected specific character after opening bracket
- `block_unexpected_close`: Unexpected block closing tag

### Component Errors
- `component_invalid_directive`: Directive type not valid on components
- `svelte_component_invalid_this`: Invalid component definition (must be expression)
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute

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
The top-level code becomes part of implicit `children` snippet, so `foo` is scoped there. Same applies to components with explicit snippet props.

### Assignment/Binding Errors
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array/index instead

Example (runes mode):
```svelte
<!-- Invalid -->
{#each array as entry}
  <button onclick={() => entry = 4}>change</button>
{/each}

<!-- Valid -->
{#each array as entry, i}
  <button onclick={() => array[i] = 4}>change</button>
{/each}
```

### CSS Errors
- `css_empty_declaration`: Declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` selector cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {...}` can only contain rules, not declarations
- `css_global_block_invalid_list`: `:global` cannot be in selector list with non-`:global` entries

Example:
```css
/* Invalid */
:global, x {
    y { color: red; }
}

/* Valid */
:global { y { color: red; } }
x y { color: red; }
```

- `css_global_block_invalid_modifier`: `:global` selector cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` can only be modified if descendant of other selectors
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` only at start/end of selector sequence, not middle
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` must not contain type/universal selectors in compound selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only in rule or first selector in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` must not be followed by type selector

### Debug/Inspection Errors
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers, not expressions
- `inspect_trace_generator`: `$inspect.trace(...)` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace(...)` must be first statement of function body

### Declaration Errors
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`
- `duplicate_class_field`: Class field already declared

### Derived/Export Errors
- `derived_invalid_export`: Cannot export derived state from module; export function returning value instead
- `state_invalid_export`: Cannot export state from module if reassigned; export function or only mutate properties

### Directive Errors
- `directive_invalid_value`: Directive value must be JavaScript expression in curly braces
- `directive_missing_name`: Directive name cannot be empty
- `let_directive_invalid_placement`: `let:` directive at invalid position
- `style_directive_invalid_modifier`: `style:` directive can only use `important` modifier

### Dollar/Reserved Name Errors
- `dollar_binding_invalid`: `$` name reserved, cannot use for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved, cannot use for variables/imports
- `global_reference_invalid`: Illegal variable name; use `globalThis.%name%` for globals

### Each Block Errors
- `each_key_without_as`: `{#each}` block without `as` clause cannot have key

### Effect Errors
- `effect_invalid_placement`: `$effect()` can only be expression statement

### Element Errors
- `element_invalid_closing_tag`: Closing tag attempted to close unopened element
- `element_invalid_closing_tag_autoclosed`: Closing tag for element already auto-closed by another element
- `element_unclosed`: Element left open
- `illegal_element_attribute`: Element does not support non-event attributes or spread attributes
- `node_invalid_placement`: Element placement violates HTML restrictions; browser will repair HTML breaking Svelte assumptions

Examples of browser HTML repair:
- `<p>hello <div>world</div></p>` → `<p>hello </p><div>world</div><p></p>` (div closes p)
- `<option><div>option a</div></option>` → `<option>option a</option>` (div removed)
- `<table><tr><td>cell</td></tr></table>` → `<table><tbody><tr><td>cell</td></tr></tbody></table>` (tbody inserted)

- `textarea_invalid_content`: `<textarea>` can have value attribute OR child content, not both
- `void_element_invalid_content`: Void elements cannot have children or closing tags

### Event Handler Errors
- `event_handler_invalid_component_modifier`: Event modifiers other than `once` only on DOM elements
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Certain modifier combinations incompatible
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes

### Export/Import Errors
- `export_undefined`: Variable not defined before export
- `module_illegal_default_export`: Component cannot have default export
- `import_svelte_internal_forbidden`: Cannot import from `svelte/internal/*` (private runtime code)
- `runes_mode_invalid_import`: Certain imports cannot be used in runes mode

### Host/Custom Element Errors
- `host_invalid_placement`: `$host()` only inside custom element component instances
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute with value

### Options/Configuration Errors
- `options_invalid_value`: Invalid compiler option
- `options_removed`: Compiler option removed
- `options_unrecognised`: Unrecognized compiler option

### Props Errors
- `bindable_invalid_location`: `$bindable()` only in `$props()` declaration
- `props_duplicate`: Cannot use `%rune%()` more than once
- `props_id_invalid_placement`: `$props.id()` only at top level as variable declaration initializer
- `props_illegal_name`: Props starting with `$$` reserved for Svelte internals
- `props_invalid_identifier`: `$props()` only with object destructuring pattern
- `props_invalid_pattern`: `$props()` assignment cannot have nested properties or computed keys
- `props_invalid_placement`: `$props()` only at top level as variable declaration initializer

### Reactive/Cycle Errors
- `reactive_declaration_cycle`: Cyclical dependency in reactive declaration
- `const_tag_cycle`: Cyclical dependency in `{@const}`

### Render Tag Errors
- `render_tag_invalid_call_expression`: Cannot call snippet using apply/bind/call
- `render_tag_invalid_expression`: `{@render}` can only contain call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread arguments in `{@render}`

### Rune Errors
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_arguments_length`: Rune must be called with specific number of arguments
- `rune_invalid_computed_property`: Cannot access computed property of rune
- `rune_invalid_name`: Not a valid rune
- `rune_invalid_spread`: Rune cannot be called with spread argument
- `rune_invalid_usage`: Cannot use rune in non-runes mode
- `rune_missing_parentheses`: Rune must have parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name

### Script Errors
- `script_duplicate`: Component can have single `<script>` and/or single `<script module>`
- `script_invalid_attribute_value`: Script attribute must be boolean if supplied
- `script_invalid_context`: Context attribute must be "module" if supplied
- `script_reserved_attribute`: Attribute reserved and cannot be used

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name in component
- `slot_attribute_invalid`: Slot attribute must be static value
- `slot_attribute_invalid_placement`: Element with `slot=` must be child of component or descendant of custom element
- `slot_default_duplicate`: Default slot content alongside explicit `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` can only receive attributes and let directives
- `slot_element_invalid_name`: Slot attribute must be static value
- `slot_element_invalid_name_default`: `default` reserved word, cannot use as slot name
- `slot_snippet_conflict`: Cannot use `<slot>` and `{@render}` in same component

### Snippet Errors
- `snippet_conflict`: Cannot use explicit children snippet with implicit children content
- `snippet_invalid_export`: Exported snippet only reference things in `<script module>` or other exportable snippets

Example:
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
- `state_field_invalid_assignment`: Cannot assign to state field before declaration
- `state_invalid_placement`: State rune only as variable declaration initializer, class field, or first assignment in constructor

Example:
```js
class Counter {
  count = $state(0);  // valid
}

class Counter {
  constructor() {
    this.count = $state(0);  // valid
  }
}
```

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to stores not declared at top level
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Cannot reference store value outside `.svelte` file

Store `$` prefix only works in `.svelte` files where Svelte auto-manages subscriptions. Consider migrating to runes.

### Svelte Meta Tag Errors
- `svelte_body_illegal_attribute`: `<svelte:body>` doesn't support non-event attributes or spread
- `svelte_boundary_invalid_attribute`: Valid attributes: `onerror`, `failed`
- `svelte:boundary_invalid_attribute_value`: Attribute value must be non-string expression
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` only has slot attribute and optional let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes/directives
- `svelte_meta_duplicate`: Component can only have one `<%name%>` element
- `svelte_meta_invalid_content`: `<%name%>` cannot have children
- `svelte_meta_invalid_placement`: `<%name%>` tags cannot be inside elements/blocks
- `svelte_meta_invalid_tag`: Invalid `<svelte:...>` tag name
- `svelte_options_deprecated_tag`: "tag" option deprecated; use "customElement" instead
- `svelte_options_invalid_attribute`: `<svelte:options>` only receives static attributes
- `svelte_options_invalid_attribute_value`: Value must be from specific list
- `svelte_options_invalid_customelement`: "customElement" must be string literal or object with tag/shadow/props
- `svelte_options_invalid_customelement_props`: "props" must be static object literal with attribute/reflect/type
- `svelte_options_invalid_customelement_shadow`: "shadow" must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute
- `svelte_self_invalid_placement`: `<svelte:self>` only in `{#if}`, `{#each}`, `{#snippet}` blocks or component slots
- `title_illegal_attribute`: `<title>` cannot have attributes/directives
- `title_invalid_content`: `<title>` only contains text and `{tags}`

### Tag/Syntax Errors
- `tag_invalid_name`: Invalid element/component name (components need valid variable name or dot notation)
- `tag_invalid_placement`: `{@%name%}` tag cannot be at this location
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected 'if', 'each', 'await', 'key', or 'snippet'
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word cannot be used here
- `unterminated_string_constant`: String not terminated

### Transition Errors
- `transition_conflict`: Cannot use `%type%:` with existing `%existing%:` directive
- `transition_duplicate`: Cannot use multiple `%type%:` directives on element

### TypeScript Errors
- `typescript_invalid_feature`: TypeScript feature not natively supported; use preprocessor in `<script>` tags

### Async/Legacy Errors
- `experimental_async`: Cannot use `await` in deriveds/template expressions/top-level unless `experimental.async` enabled
- `legacy_await_invalid`: Cannot use `await` in deriveds/template expressions/top-level unless in runes mode
- `legacy_export_invalid`: Cannot use `export let` in runes mode; use `$props()` instead
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode; use `$derived` or `$effect`
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode

### Miscellaneous Errors
- `invalid_arguments_usage`: `arguments` keyword cannot be used in template or top-level component
- `js_parse_error`: JavaScript parse error with message
- `style_duplicate`: Component can have single top-level `<style>` element

### compiler-warnings
Complete reference of Svelte compiler warnings covering accessibility (a11y_*), attributes, structure, reactivity, and deprecated patterns; disable with `<!-- svelte-ignore code -->` comments.

## Compiler Warnings Reference

Svelte warns at compile time about potential mistakes like inaccessible markup. Warnings can be disabled with `<!-- svelte-ignore <code> -->` comments.

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />

<!-- Multiple rules, with note -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) -->
<div onclick>...</div>
```

### Accessibility Warnings (a11y_*)

**a11y_accesskey**: Avoid `accesskey` attribute - creates inconsistencies with screen readers.
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
<!-- Better: use <button> or <a> -->
```

**a11y_consider_explicit_label**: Buttons and links need text or `aria-label`/`aria-labelledby`/`title`.

**a11y_distracting_elements**: Avoid `<marquee>` and `<blink>`.

**a11y_figcaption_index/parent**: `<figcaption>` must be first/last child and immediate child of `<figure>`.
```svelte
<div><figcaption>Caption</figcaption></div> <!-- warning -->
```

**a11y_hidden**: Certain elements (`h1-h6`, etc.) should not be hidden with `aria-hidden="true"`.
```svelte
<h2 aria-hidden="true">invisible header</h2> <!-- warning -->
```

**a11y_img_redundant_alt**: `<img>` alt text should not contain "image", "picture", or "photo" (screen readers already announce it).
```svelte
<img src="foo" alt="Photo of foo" /> <!-- warning -->
<img src="foo" alt="Foo eating" /> <!-- OK -->
```

**a11y_incorrect_aria_attribute_type**: ARIA attributes must have correct types (boolean, string, ID, ID list, integer, token, token list, tristate).
```svelte
<div aria-hidden="yes"></div> <!-- warning: must be true/false -->
```

**a11y_interactive_supports_focus**: Interactive roles must have `tabindex`.
```svelte
<div role="button" onkeypress={() => {}} /> <!-- warning -->
```

**a11y_invalid_attribute**: Attributes like `href` must have valid values (not empty, `#`, or `javascript:`).
```svelte
<a href="">invalid</a> <!-- warning -->
```

**a11y_label_has_associated_control**: `<label>` must be associated with control via wrapping or `for` attribute.
```svelte
<label>A</label> <!-- warning -->
<label for="id">B</label> <!-- OK -->
<label>C <input type="text" /></label> <!-- OK -->
```

**a11y_media_has_caption**: `<video>` must have `<track kind="captions">` (not needed if `muted`).
```svelte
<video></video> <!-- warning -->
<video><track kind="captions" /></video> <!-- OK -->
<audio muted></audio> <!-- OK -->
```

**a11y_misplaced_role**: Reserved elements should not have `role` attribute.
```svelte
<meta role="tooltip" /> <!-- warning -->
```

**a11y_misplaced_scope**: `scope` attribute only for `<th>` elements.
```svelte
<div scope="row" /> <!-- warning -->
```

**a11y_missing_attribute**: Required attributes: `<a>` needs `href`, `<area>` needs `alt`/`aria-label`/`aria-labelledby`, `<html>` needs `lang`, `<iframe>` needs `title`, `<img>` needs `alt`, `<object>` needs `title`/`aria-label`/`aria-labelledby`, `<input type="image">` needs `alt`/`aria-label`/`aria-labelledby`.
```svelte
<input type="image" /> <!-- warning -->
<html></html> <!-- warning -->
<a>text</a> <!-- warning -->
```

**a11y_missing_content**: Headings and anchors must have accessible content.
```svelte
<a href="/foo"></a> <!-- warning -->
<h1></h1> <!-- warning -->
```

**a11y_mouse_events_have_key_events**: `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`.
```svelte
<div onmouseover={handleMouseover} /> <!-- warning -->
<div onmouseout={handleMouseout} /> <!-- warning -->
```

**a11y_no_abstract_role**: Abstract ARIA roles forbidden.

**a11y_no_interactive_element_to_noninteractive_role**: Interactive elements cannot have non-interactive roles (`article`, `banner`, `complementary`, `img`, `listitem`, `main`, `region`, `tooltip`).
```svelte
<textarea role="listitem"></textarea> <!-- warning -->
```

**a11y_no_noninteractive_element_interactions**: Non-interactive elements (`main`, `area`, `h1-h6`, `p`, `img`, `li`, `ul`, `ol`, or with non-interactive roles) should not have mouse/keyboard handlers.
```svelte
<li onclick={() => {}}></li> <!-- warning -->
<div role="listitem" onclick={() => {}}></div> <!-- warning -->
```

**a11y_no_noninteractive_element_to_interactive_role**: Non-interactive elements cannot have interactive roles (`button`, `link`, `checkbox`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `option`, `radio`, `searchbox`, `switch`, `textbox`).
```svelte
<h3 role="searchbox">Button</h3> <!-- warning -->
```

**a11y_no_noninteractive_tabindex**: Non-interactive elements cannot have non-negative `tabindex`.
```svelte
<div tabindex="0"></div> <!-- warning -->
```

**a11y_no_redundant_roles**: Don't repeat default ARIA roles.
```svelte
<button role="button">...</button> <!-- warning -->
<img role="img" src="foo.jpg" /> <!-- warning -->
```

**a11y_no_static_element_interactions**: Elements with interactive handlers must have ARIA role.
```svelte
<div onclick={() => ''}></div> <!-- warning -->
```

**a11y_positive_tabindex**: Avoid `tabindex` > 0 (breaks tab order).
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
<li aria-required></li> <!-- warning -->
```

**a11y_unknown_aria_attribute**: Only valid ARIA attributes allowed (with suggestions).
```svelte
<input type="image" aria-labeledby="foo" /> <!-- warning: did you mean aria-labelledby? -->
```

**a11y_unknown_role**: Only valid, non-abstract ARIA roles allowed (with suggestions).
```svelte
<div role="toooltip"></div> <!-- warning: did you mean tooltip? -->
```

### Attribute Warnings

**attribute_avoid_is**: `is` attribute not cross-browser compatible.

**attribute_global_event_reference**: Referencing `globalThis.%name%` without declaration.

**attribute_illegal_colon**: Attributes should not contain `:` (ambiguous with directives).

**attribute_invalid_property_name**: Invalid HTML attribute (with suggestions).

**attribute_quoted**: Quoted attributes on components will be stringified in future versions.

### Other Warnings

**bidirectional_control_characters**: Bidirectional control characters detected (can alter code direction/behavior).

**bind_invalid_each_rest**: Rest operator in binding creates new object, breaking binding with original.

**block_empty**: Empty block detected.

**component_name_lowercase**: Components must start with capital letter.
```svelte
<mycomponent /> <!-- treated as HTML element -->
```

**css_unused_selector**: CSS selector not used in template. Use `:global()` to preserve:
```svelte
<div class="post">{@html content}</div>
<style>
  .post :global(p) { ... }
</style>
```

**custom_element_props_identifier**: Using rest element or non-destructured `$props()` prevents custom element prop inference.

**element_implicitly_closed**: HTML elements implicitly closed by another element. Add explicit closing tag.
```svelte
<p><p>hello</p> <!-- first <p> implicitly closed -->
```

**element_invalid_self_closing_tag**: Self-closing tags for non-void elements are ambiguous. Use explicit closing tags.
```svelte
<span class="icon" /> some text <!-- parsed as <span>some text</span> -->
<span class="icon"></span> some text <!-- correct -->
```

**event_directive_deprecated**: `on:%name%` deprecated, use `on%name%` attribute instead.

**export_let_unused**: Unused export property (use `export const` for external reference only).

**legacy_code**: Old syntax no longer valid (with suggestions).

**legacy_component_creation**: Svelte 5 components not classes; use `mount` or `hydrate` from 'svelte'.

**node_invalid_placement_ssr**: HTML structure violation causing browser repair, breaking hydration. Examples: `<p>` cannot contain block elements, `<option>` cannot contain `<div>`, `<table>` auto-inserts `<tbody>`.

**non_reactive_update**: Variable updated but not declared with `$state()`, won't trigger updates.
```svelte
<script>
  let stale = 'stale'; // warning
  let reactive = $state('reactive'); // OK
</script>
<button onclick={() => { stale = 'updated'; reactive = 'updated'; }}>
```

**options_deprecated_accessors/immutable**: Options deprecated in runes mode.

**options_missing_custom_element**: `customElement` option used but `customElement: true` not set.

**options_removed_***: Removed options: `enableSourcemap`, `hydratable`, `loopGuardTimeout`.

**options_renamed_ssr_dom**: `generate: "dom"/"ssr"` renamed to `"client"/"server"`.

**perf_avoid_inline_class/nested_class**: Declare classes at top level, not inline or nested.

**reactive_declaration_invalid_placement**: Reactive declarations only at top level of instance script.

**reactive_declaration_module_script_dependency**: Module-level reassignments don't trigger reactive statements.

**script_context_deprecated**: `context="module"` deprecated, use `module` attribute.
```svelte
<script module>
  let foo = 'bar';
</script>
```

**script_unknown_attribute**: Unrecognized script attribute (should be `generics`, `lang`, or `module`).

**slot_element_deprecated**: `<slot>` deprecated, use `{@render ...}` instead.

**state_referenced_locally**: Reactive variable referenced in same scope after reassignment breaks reactivity. Wrap in function for lazy evaluation.
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
<p>The count is {count()}</p> <!-- call function -->
```

**store_rune_conflict**: Local binding conflicts with `$%name%` store rune. Rename to avoid ambiguity.

**svelte_component_deprecated**: `<svelte:component>` deprecated in runes mode (components dynamic by default). Use `@const` or derived values:
```svelte
{#each items as item}
  {@const Component = item.condition ? Y : Z}
  <Component />
{/each}
```

**svelte_element_invalid_this**: `<svelte:element this={expression}>` should use expression, not string.

**svelte_self_deprecated**: `<svelte:self>` deprecated, use self-imports instead.

**unknown_code**: Unrecognized warning code (with suggestions).

### runtime-errors
Reference of 50+ runtime errors in Svelte 5: client-side (deriveds, bindings, effects, state mutations, snippets), server-side (async rendering, lifecycle), and shared (context, snippets, lifecycle scope); includes error messages and solutions with code examples.

## Client Errors

**async_derived_orphan**: Cannot create `$derived(...)` with `await` outside effect tree. Deriveds run lazily and can be garbage collected, but effects run eagerly and need to be destroyed. Async deriveds use effects internally, so they can only be created inside other effects.

**bind_invalid_checkbox_value**: Use `bind:checked` instead of `bind:value` for checkbox inputs.

**bind_invalid_export**: Cannot use `bind:key` on exported properties. Use `bind:this` to get component instance, then access property directly: `component.key`.

**bind_not_bindable**: Cannot bind to non-bindable properties. Mark properties as bindable with: `let { key = $bindable() } = $props()`.

**component_api_changed**: Calling methods on component instances is invalid in Svelte 5. See migration guide.

**component_api_invalid_new**: Cannot instantiate components with `new`. Set `compatibility.componentApi` to `4` for legacy support.

**derived_references_self**: Derived values cannot reference themselves recursively.

**each_key_duplicate**: Keyed each blocks have duplicate keys at specified indexes/values.

**effect_in_teardown**: Cannot use runes inside effect cleanup functions.

**effect_in_unowned_derived**: Effects cannot be created inside `$derived` values that weren't themselves created inside an effect.

**effect_orphan**: Runes can only be used inside effects (e.g., during component initialization).

**effect_pending_outside_reaction**: `$effect.pending()` can only be called inside effects or deriveds.

**effect_update_depth_exceeded**: Maximum update depth exceeded, typically when an effect reads and writes the same state. Example causing infinite loop:
```js
let count = $state(0);
$effect(() => { count += 1; }); // reads and writes count
```
Same issue with array mutations:
```js
let array = $state(['hello']);
$effect(() => { array.push('goodbye'); }); // reads and writes array
```
Effects can re-run if they settle (e.g., sorting already-sorted array is fine). Solution: make non-state values normal variables, or use `untrack()` to avoid adding state as dependency.

**experimental_async_fork**: Cannot use `fork(...)` unless `experimental.async` compiler option is `true`.

**flush_sync_in_effect**: Cannot use `flushSync` inside effects. Can call after state changes but not during effect flushing. Only applies with `experimental.async` option.

**fork_discarded**: Cannot commit a fork that was already discarded.

**fork_timing**: Cannot create fork inside effect or when state changes are pending.

**get_abort_signal_outside_reaction**: `getAbortSignal()` can only be called inside effects or deriveds.

**hydration_failed**: Failed to hydrate the application.

**invalid_snippet**: Cannot render snippet if expression is null/undefined. Use optional chaining: `{@render snippet?.()}`.

**lifecycle_legacy_only**: Cannot use lifecycle functions in runes mode.

**props_invalid_value**: Cannot do `bind:key={undefined}` when key has a fallback value.

**props_rest_readonly**: Rest element properties of `$props()` are readonly.

**rune_outside_svelte**: Runes only available inside `.svelte` and `.svelte.js/ts` files.

**set_context_after_init**: `setContext` must be called during component initialization, not in effects or after `await`. Only applies with `experimental.async` option.

**state_descriptors_fixed**: Property descriptors on `$state` objects must contain `value` and be `enumerable`, `configurable`, and `writable`.

**state_prototype_fixed**: Cannot set prototype of `$state` object.

**state_unsafe_mutation**: Cannot update state inside `$derived(...)`, `$inspect(...)`, or template expressions. Example:
```svelte
<script>
  let count = $state(0);
  let even = $state(true);
  let odd = $derived.by(() => {
    even = count % 2 === 0; // ERROR: updating state in derived
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
Or use `$effect` if side-effects are unavoidable.

**svelte_boundary_reset_onerror**: `<svelte:boundary>` `reset` function cannot be called synchronously in `onerror` callback. Wait for boundary to settle first:
```svelte
<svelte:boundary onerror={async (error, reset) => {
  fixTheError();
  await tick();
  reset();
}}>
</svelte:boundary>
```

## Server Errors

**await_invalid**: Encountered async work while rendering synchronously. Either await `render(...)` result or wrap `await` in `<svelte:boundary>` with `pending` snippet.

**html_deprecated**: `html` property of server render results deprecated. Use `body` instead.

**lifecycle_function_unavailable**: Certain methods like `mount` unavailable on server. Don't call them eagerly during render.

## Shared Errors

**invalid_default_snippet**: Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead. Parent with `let:` directive incompatible with child expecting snippet rendering.

**invalid_snippet_arguments**: Snippet functions passed invalid arguments. Snippets should only be instantiated via `{@render ...}`.

**lifecycle_outside_component**: Lifecycle methods can only be used during component initialization at top level of instance script:
```svelte
<script>
  import { onMount } from 'svelte';
  onMount(() => {}) // correct
  function handleClick() {
    onMount(() => {}) // wrong
  }
</script>
```

**missing_context**: Context not set in parent component. `createContext()` returns `[get, set]` pair; `get` throws if `set` not called in parent.

**snippet_without_render_tag**: Attempted to render snippet without `{@render}` block. Change `{snippet}` to `{@render snippet()}`. Examples:
```svelte
<!-- Wrong -->
<script>
  let { children } = $props();
</script>
{children}

<!-- Correct -->
{@render children()}
```

**store_invalid_shape**: Value is not a store with `subscribe` method.

**svelte_element_invalid_this_value**: `this` prop on `<svelte:element>` must be a string if defined.

### runtime_warnings
Reference of 20 runtime warnings in Svelte: assignment operators, async reactivity, hydration mismatches, binding/mutation rules, proxy identity issues, and transition/element constraints.

## Client Warnings

**assignment_value_stale**: Assignment operators like `??=` evaluate to the right-hand side value, not the final state value. Fix by separating into two statements:
```js
object.array ??= [];
object.array.push(object.array.length);
```

**await_reactivity_loss**: State read after `await` in async functions may not be tracked. Pass values as function parameters:
```js
async function sum(a, b) { return await a + b; }
let total = $derived(await sum(a, b));
```

**await_waterfall**: Sequential `$derived(await ...)` creates unnecessary waterfalls. Create promises first, then await:
```js
let aPromise = $derived(one());
let bPromise = $derived(two());
let a = $derived(await aPromise);
let b = $derived(await bPromise);
```

**binding_property_non_reactive**: Binding to non-reactive properties.

**console_log_state**: Logging `$state` proxies shows proxy internals. Use `$inspect()` or `$state.snapshot()` instead.

**event_handler_invalid**: Event handler is not a function.

**hydration_attribute_changed**: Attributes like `src` on `<img>` won't update during hydration. Use `svelte-ignore` or force update via `$effect`:
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

**hydration_html_changed**: `{@html}` block values that differ between server/client won't update. Use same pattern as hydration_attribute_changed.

**hydration_mismatch**: Server HTML structure doesn't match client DOM. Check for invalid HTML that the DOM auto-repairs.

**invalid_raw_snippet_render**: `createRawSnippet` render function must return HTML for a single element.

**legacy_recursive_reactive_block**: Migrated `$:` blocks that access and update the same value may cause recursive updates when converted to `$effect`.

**lifecycle_double_unmount**: Attempted to unmount a component that wasn't mounted.

**ownership_invalid_binding**: Parent component didn't declare binding. Use `bind:` instead of property passing:
```svelte
<!-- GrandParent -->
<Parent bind:value />
<!-- instead of -->
<Parent {value} />
```

**ownership_invalid_mutation**: Mutating unbound props is discouraged. Use `$bindable` or callbacks:
```svelte
<!-- App.svelte -->
<Child {person} />
<!-- Child.svelte -->
<script>
	let { person } = $props();
</script>
<input bind:value={person.name}>
```
Fix: Mark `person` as `$bindable` in App or use callbacks.

**select_multiple_invalid_value**: `<select multiple value={...}>` requires array value, not other types.

**state_proxy_equality_mismatch**: `$state()` creates proxies with different identity than original values. Comparisons fail:
```js
let value = { foo: 'bar' };
let proxy = $state(value);
value === proxy; // always false
```
Compare values where both/neither use `$state()`.

**state_proxy_unmount**: Don't pass `$state` proxy to `unmount()`. Use `$state.raw()` if reactivity needed.

**svelte_boundary_reset_noop**: `<svelte:boundary>` reset function only works once. Don't store reference outside boundary.

**transition_slide_display**: `slide` transition requires `display: block/flex/grid`. Doesn't work with `inline`, `table`, or `contents`.

## Shared Warnings

**dynamic_void_element_content**: Void elements like `<input>` cannot have content.

**state_snapshot_uncloneable**: `$state.snapshot()` cannot clone certain objects (DOM elements, etc.). Original value returned for uncloneable properties.

