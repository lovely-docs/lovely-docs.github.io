**Markup:** Lowercase/capitalized tags for elements/components; attributes with JS expressions; shorthand `{name}`; spread `{...obj}`.

**Events:** `on` prefix (case-sensitive); delegated for performance; `ontouchstart`/`ontouchmove` passive.

**Text/HTML:** `{expr}` renders text; `{@html string}` injects HTML (sanitize for XSS); `:global` styles injected content.

**Conditionals:** `{#if}...{:else if}...{:else}...{/if}`.

**Iteration:** `{#each items as item (key)}...{:else}...{/each}` with optional index, destructuring, keying.

**Key blocks:** `{#key expr}...{/key}` destroys/recreates on change.

**Async:** `{#await promise}pending{:then val}ok{:catch err}error{/await}`; lazy imports; SSR support.

**Snippets:** `{#snippet name(params)}...{/snippet}` reusable markup; `{@render name(args)}`; pass as props; implicit `children`; type with `Snippet<[Types]>`.

**Bindings:** `bind:property` two-way; inputs (value/checked/group/files), selects, media, dimensions, refs, component props; function bindings for validation.

**Actions:** `use:actionName` mounts on element; `$effect` for setup/teardown; typed with `Action<Node, Param, Events>`.

**Attachments (5.29+):** `{@attach fn}` reactive on mount/state changes; factories; inline; on components via Symbol keys.

**Transitions:** `transition:name` bidirectional; `|global` modifier; `in:`/`out:` unidirectional; custom with `css(t,u)` or `tick(t,u)`.

**Animations:** `animate:name` in keyed each; custom with `from`/`to` DOMRect.

**Styling:** `style:prop="val"` or `style:prop={expr}`; `|important` modifier; precedence over attributes.

**Classes:** `class:name={cond}` or `class={obj/array}`; arrays flatten nested; type with `ClassValue`.

**Special:** `{@const}` block-scoped constant; `{@debug}` logging/pause; `{@render}` snippet invocation.

**Async/await (5.36+, experimental):** `await` in script/`$derived`/markup; synchronized updates; parallel concurrency; `<svelte:boundary pending>` for loading states; `fork()` preloading.