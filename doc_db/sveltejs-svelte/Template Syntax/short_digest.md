
## Core Template Features

**Markup & Expressions**
- Lowercase tags are HTML, capitalized/dot-notation tags are components
- Attributes support expressions: `<button disabled={!clickable}>` or shorthand `<button {disabled}>`
- Text interpolation: `{name}` renders expression, `{@html html}` injects raw HTML (sanitize to prevent XSS)
- Boolean attributes included if truthy, spread with `{...things}`

**Control Flow**
- Conditionals: `{#if}...{:else if}...{:else}...{/if}`
- Loops: `{#each items as item, i (key)}...{/each}` with optional keying for efficient updates
- Async: `{#await promise}...{:then value}...{:catch error}...{/await}`
- Key block: `{#key expr}...{/key}` destroys/recreates on expression change

**Events & Binding**
- Listen: `<button on:click={handler}>`
- Two-way binding: `bind:value`, `bind:checked`, `bind:group`, `bind:this`, `bind:open` on elements and components
- Component props marked with `$bindable()`: `let { prop = $bindable() } = $props()`
- Function binding for validation: `bind:value={get, set}`

**Snippets & Rendering**
- Define: `{#snippet name(params)}...{/snippet}`
- Render: `{@render name()}` or `{@render optional?.()}`
- Pass to components explicitly or implicitly via nested snippets

**Styling & Directives**
- `class:name={bool}` or `class={{ name: bool, other: value }}`
- `style:property={value}` or `style:property|important={value}`
- `use:action` attaches setup/teardown via `$effect`
- `transition:fade|global={{duration: 2000}}` for enter/leave animations
- `in:fly out:fade` for separate non-bidirectional transitions
- `animate:flip` in keyed `#each` blocks for reordering animations

**Utility Tags**
- `{@const area = w * h}` defines local constants in block scope
- `{@debug var1, var2}` logs on change and pauses with devtools
- `svelte-ignore` disables warnings, `@component` shows documentation on hover
