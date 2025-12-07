## Svelte Compiler Errors

Complete reference of all compiler error codes organized by category:

**Animation**: duplicate, invalid placement, missing key

**Attributes**: contenteditable issues, duplicates, empty shorthand, invalid event handlers, invalid names/types/sequences, unquoted sequences

**Bindings**: invalid expressions/names/targets/values, group binding issues, snippet parameter binding

**Blocks**: duplicate clauses, invalid placement/continuation, unclosed, unexpected characters/closes, wrong syntax (elseif vs else if)

**Components**: invalid directives

**Const Tags**: cyclical dependencies, invalid expressions/placement/references. Example: `{@const}` in `<svelte:boundary>` becomes part of implicit `children` snippet, unavailable to other snippets.

**CSS**: empty declarations, invalid identifiers, `:global` issues (combinator, declaration, list mixing, modifiers, placement, selectors), nesting selector placement, invalid selectors

Example invalid CSS mixing `:global` and scoped:
```css
:global, x { y { color: red; } }  /* error */
/* split into: */
:global { y { color: red; } }
x y { color: red; }
```

**Declarations**: duplicates, module import conflicts

**Derived/Directives**: invalid exports, invalid values, missing names

**Dollar Prefix**: `$` reserved for variables/imports

**Each Blocks**: invalid assignments in runes mode (use array[i] instead), key without as clause

Example (runes mode):
```svelte
{#each array as entry, i}
	<button onclick={() => array[i] = 4}>change</button>
{/each}
```

**Effects**: invalid placement

**Elements**: invalid/unclosed closing tags, auto-closed violations

**Event Handlers**: invalid modifiers/combinations, component-only restrictions

**Expected**: attribute values, block types, identifiers, patterns, tokens, whitespace

**Experimental**: `await` requires `experimental.async` option

**Exports**: undefined variables, invalid in runes mode

**Global References**: illegal names (use `globalThis.name`)

**Host**: `$host()` only in custom elements

**Imports**: `svelte/internal/*` forbidden

**Inspect**: `$inspect.trace()` restrictions (no generators, first statement only)

**Legacy**: `await`, `export let`, `$$props`, `$:`, `$$restProps` invalid in runes mode

**Let Directives**: invalid placement

**Module**: no default exports

**Node Placement**: HTML repair breaks Svelte assumptions (e.g., `<p><div>` → `<p></p><div>`)

**Options**: invalid/removed/unrecognized compiler options

**Props**: duplicates, invalid placement/patterns/identifiers, illegal names ($$), `$props.id()` restrictions

**Reactive**: cyclical dependencies

**Render Tags**: invalid expressions/calls/spreads

**Runes**: invalid arguments/names/usage, missing parentheses, removed/renamed runes

**Scripts**: duplicates, invalid attributes/context, reserved attributes, `$bindable()` placement

**Slots**: duplicates, invalid attributes/placement/names, default conflicts, invalid content, `<slot>` vs `{@render}` conflict

**Snippets**: conflicts with children, invalid exports (can't reference module-level script), no rest parameters, parameter assignment, prop shadowing

Example invalid export:
```svelte
<script module>export { greeting };</script>
<script>let message = 'hello';</script>
{#snippet greeting(name)}<p>{message} {name}!</p>{/snippet}  /* error */
```

**State**: field duplicates, invalid assignments/exports/placement. Declarations in class body or constructor, only once.

**Stores**: subscription restrictions (top-level only, not in module, `.svelte` files only)

**Style**: invalid modifiers (only `important`), duplicates

**Svelte Elements**: `<svelte:body>` (no non-event attrs), `<svelte:boundary>` (onerror/failed only), `<svelte:component>` (needs this), `<svelte:element>` (needs this), `<svelte:fragment>` (slot/let only, direct child), `<svelte:head>` (no attrs), `<svelte:self>` (if/each/snippet/slots only), `<svelte:options>` (static attrs, customElement/tag/shadow/props validation)

**Tags**: invalid names, invalid placement

**Textarea**: value attribute OR child content, not both

**Title**: no attributes/directives, text and `{tags}` only

**Transitions**: conflicts, duplicates

**TypeScript**: not natively supported; use preprocessor like `vitePreprocess({ script: true })`

**Misc**: unexpected EOF, reserved words, unterminated strings, void element content