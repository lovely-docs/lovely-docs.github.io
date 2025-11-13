## Core Syntax
- **Tags**: Lowercase = HTML, capitalized/dot notation = components
- **Attributes**: `attr={expr}`, shorthand `{name}`, spread `{...obj}`, boolean if truthy
- **Events**: `on` prefix (case-sensitive), delegated events need `bubbles: true`
- **Text**: `{expr}` interpolation, `{@html string}` for raw HTML

## Control Flow
- `{#if}...{:else if}...{:else}...{/if}` - conditional rendering
- `{#each items as item, i (key)}...{:else}...{/each}` - iteration with keying
- `{#key expr}` - destroy/recreate on change
- `{#await promise}...{:then}...{:catch}...{/await}` - Promise handling

## Snippets & Components
- `{#snippet name(params)}...{/snippet}` - reusable markup blocks
- `{@render snippet()}` - render snippets with optional chaining `snippet?.()`
- Snippets as props; non-snippet content = `children` snippet

## Directives
- `bind:property` - two-way binding (inputs, selects, media, component props)
- `use:action` - lifecycle-managed functions
- `transition:name|global` - enter/exit animations
- `in:/out:` - non-bidirectional transitions
- `animate:name` - reorder animations in keyed each
- `style:property|important` - inline styles
- `class:name` or `class={obj/array}` - conditional/combined classes

## Special Tags
- `{@const name = value}` - block-scoped constants
- `{@debug var}` - log on change, pause if devtools open
- `{@attach fn}` - mount lifecycle with cleanup