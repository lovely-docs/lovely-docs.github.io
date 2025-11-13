## Markup & Attributes
HTML tags are lowercase, components are capitalized or use dot notation. Attributes accept unquoted values, expressions, or pure expressions. Boolean attributes include if truthy, exclude if falsy. Shorthand `{name}` replaces `name={name}`. Spread attributes with `{...object}` override in order.

## Events & Text
Listen to DOM events with `on` prefix (case-sensitive: `onclick` vs `onClick`). Delegated events require `bubbles: true` when dispatching manually. Text expressions use `{expression}` syntax; null/undefined omit, others coerce to strings. Use `{@html string}` for raw HTML (ensure safe). HTML comments work normally; `<!-- svelte-ignore a11y_autofocus -->` disables warnings.

## Conditional & Iteration
`{#if condition}...{:else if}...{:else}...{/if}` for conditional rendering. `{#each items as item, i (key)}...{:else}...{/each}` for iteration with optional keying, destructuring, and else fallback. `{#key expression}` destroys/recreates contents when expression changes.

## Async & Promises
`{#await promise}pending{:then value}fulfilled{:catch error}rejected{/await}` handles Promise states. Omit branches as needed. Only pending renders during SSR.

## Snippets & Rendering
`{#snippet name(params)}...{/snippet}` defines reusable markup blocks with parameters and default values. `{@render snippet()}` renders snippets; use optional chaining `{@render snippet?.()}` for optional snippets. Snippets passed as props become component props; non-snippet content becomes `children` snippet.

## Directives
`bind:property={value}` enables two-way binding on inputs, selects, media, and component props (mark props with `$bindable()`). `use:action={params}` attaches lifecycle-managed functions to elements. `transition:name={params}` animates elements entering/leaving DOM; use `|global` modifier for parent block changes. `in:` and `out:` apply non-bidirectional transitions. `animate:name={params}` triggers animations when keyed each items reorder. `style:property={value}` sets inline styles with `|important` modifier. `class:name={condition}` conditionally applies classes; `class` attribute accepts objects/arrays for combining classes.

## Special Tags
`{@const name = value}` defines block-scoped constants. `{@debug var1, var2}` logs variables on change and pauses if devtools open. `{@attach function}` runs functions on element mount with optional cleanup. `{@render snippet()}` renders snippets.

## Experimental: Await Expressions
Enable with `experimental.async: true`. Use `await` in component scripts, `$derived()`, and markup for synchronized updates. `$effect.pending()` detects async work; `settled()` waits for completion. `fork()` preloads expected await expressions.