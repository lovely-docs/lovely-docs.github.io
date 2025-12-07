## Core Markup
- Lowercase tags (`<div>`) are HTML elements; capitalized/dot-notation tags (`<Widget>`, `<my.stuff>`) are components
- Attributes support unquoted values, JS expressions, or pure expressions: `<input type=checkbox />`, `<a href="page/{p}">`, `<button disabled={!clickable}>`
- Boolean attributes included if truthy, excluded if falsy; other attributes included unless null/undefined
- Shorthand: `{name}` instead of `name={name}` when names match
- Spread attributes: `<Widget a="b" {...things} c="d" />` (order matters, later overrides earlier)

## Events
- Listen with `on` prefix: `<button onclick={() => console.log('clicked')}>`
- Case-sensitive: `onclick` vs `onClick`
- Event attributes fire after bindings
- `ontouchstart` and `ontouchmove` are passive; use `on` from `svelte/events` to prevent defaults
- Delegated events (for performance): `beforeinput`, `click`, `change`, `dblclick`, `contextmenu`, `focusin`, `focusout`, `input`, `keydown`, `keyup`, `mousedown`, `mousemove`, `mouseout`, `mouseover`, `mouseup`, `pointerdown`, `pointermove`, `pointerout`, `pointerover`, `pointerup`, `touchend`, `touchmove`, `touchstart`

## Text & HTML
- Text expressions in braces: `<h1>Hello {name}!</h1>`, `<p>{a} + {b} = {a + b}</p>`
- `null` and `undefined` omitted; others coerced to strings
- Use HTML entities for literal braces: `&lbrace;` or `&#123;` for `{`, `&rbrace;` or `&#125;` for `}`
- `{@html string}` injects raw HTML (sanitize to prevent XSS); injected HTML bypasses scoped styles, use `:global` to style it

## Comments
- HTML comments: `<!-- comment -->`
- `<!-- svelte-ignore a11y_autofocus -->` disables warnings for next block
- `<!-- @component ... -->` shows on hover in other files, supports markdown

## Conditional Rendering
- `{#if expr}...{:else if expr}...{:else}...{/if}` wraps elements or text

## Iteration
- `{#each items as item}...{/each}` iterates arrays/iterables
- With index: `{#each items as item, i}...{/each}`
- Keyed: `{#each items as item (item.id)}...{/each}` for intelligent reordering (insert/move/delete)
- Destructuring: `{#each items as { id, name, qty }, i (id)}...{/each}` or `{#each items as [id, ...rest]}...{/each}`
- Without binding: `{#each { length: 8 }, rank}...{/each}` renders n times
- Else clause: `{#each todos as todo}...{:else}<p>No tasks</p>{/each}`

## Key Blocks
- `{#key expr}...{/key}` destroys and recreates contents when expression changes
- Causes components to reinstantiate and reinitialize
- Useful for triggering transitions: `{#key value}<div transition:fade>{value}</div>{/key}`

## Async/Await
- `{#await promise}pending{:then value}resolved{:catch error}error{/await}`
- Omit blocks as needed: `{#await promise then value}...{/await}` or `{#await promise catch error}...{/await}`
- SSR renders only pending branch; non-Promise expressions render only then branch
- Lazy component loading: `{#await import('./Component.svelte') then { default: Component }}<Component />{/await}`

## Snippets
- Reusable markup blocks: `{#snippet name(param1, param2)}...{/snippet}`, rendered with `{@render name(args)}`
- Can reference enclosing scope and recursively call themselves
- Pass as props: `<Table {header} {row} />` or implicitly inside components
- Implicit `children` snippet: content inside component tags becomes `children` prop
- Optional snippets: `{@render children?.()}` or conditional `{#if children}{@render children()}{:else}fallback{/if}`
- Type with `Snippet<[Types]>`: `let { row }: { row: Snippet<[Item]> } = $props();`
- Export from `<script module>`: `export { snippetName };` (Svelte 5.5.0+)

## Directives

### bind: (Two-way binding)
- `bind:property={expr}` or shorthand `bind:property` (if name matches)
- Input bindings: `bind:value` (numeric inputs coerce to number), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox), `bind:files`
- Select: `bind:value` (any type), `<select multiple bind:value={array}>`
- Media (`<audio>`, `<video>`): two-way `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`, `videoWidth`, `videoHeight`
- Image: readonly `naturalWidth`, `naturalHeight`
- Details: `bind:open`
- Contenteditable: `bind:innerHTML`, `bind:innerText`, `bind:textContent`
- Dimensions (readonly, ResizeObserver): `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`
- `bind:this={ref}` gets DOM node reference (undefined until mounted)
- Component props: mark as bindable with `$bindable()` rune
- Function bindings (5.9.0+): `bind:value={() => value, (v) => value = v.toLowerCase()}` for validation/transformation; readonly: `bind:clientWidth={null, redraw}`

### use: (Actions)
- `use:actionName` or `use:actionName={params}` mounts action on element
- Actions are functions called on mount: `function myaction(node) { $effect(() => { /* setup */ return () => { /* teardown */ }; }); }`
- Runs once on mount, not reactive to argument changes
- Type with `Action<NodeType, ParamType, { onCustomEvent: (e: CustomEvent) => void }>`

### @attach (Attachments, 5.29+)
- `{@attach attachmentFn}` runs reactive function on element mount/state changes
- Can return cleanup function
- Factories: `function tooltip(content) { return (element) => { /* setup */ return cleanup; }; }`
- Inline: `{@attach (canvas) => { const ctx = canvas.getContext('2d'); $effect(() => { /* reactive */ }); }}`
- On components: creates Symbol-keyed prop, enables wrapper components
- Fully reactive: re-runs on changes to function, arguments, or state read inside

### transition: (Bidirectional transitions)
- `transition:transitionName` or `transition:transitionName={{ duration: 2000 }}`
- Local by default (play when block created/destroyed); `|global` modifier plays when parent blocks change
- Custom: `function whoosh(node, params) { return { delay, duration, easing, css: (t, u) => string, tick: (t, u) => void }; }`
- `t` is 0-1 after easing (0 for out, 1 for in); `u` equals `1 - t`
- Prefer `css` over `tick` for performance
- Events: `introstart`, `introend`, `outrostart`, `outroend`

### in: and out: (Unidirectional transitions)
- `in:transitionName` and `out:transitionName` play independently, don't reverse each other
- If block removed during `in` transition, both continue playing
- If `out` aborted, all transitions restart

### animate: (Reordering animations)
- `animate:animationName` on immediate children of keyed each blocks
- Triggered when data item index changes (not on add/remove)
- Custom: `function whizz(node, { from, to }, params) { return { delay, duration, easing, css: (t, u) => string, tick: (t, u) => void }; }`
- `from` and `to` are DOMRect objects
- Prefer `css` over `tick`

### style: (CSS styling)
- `style:property="value"` or `style:property={value}` or shorthand `style:property`
- Multiple: `style:color style:width="12rem" style:background-color={expr}`
- `|important` modifier: `style:color|important="red"`
- Directives take precedence over style attributes, even `!important`

### class: (Conditional classes)
- `class:className={condition}` or shorthand `class:className`
- Attribute form (preferred): `class={condition ? 'large' : 'small'}`, `class={{ cool, lame: !cool }}`, `class={[faded && 'opacity-50', large && 'scale-200']}`
- Arrays flatten nested arrays/objects, useful for combining local + prop classes
- Type safety (5.19+): `import type { ClassValue } from 'svelte/elements';`

## Special Tags

### {@const}
- `{@const area = box.width * box.height}` declares block-scoped constant
- Only allowed as immediate child of block, component, or `<svelte:boundary>`

### {@debug}
- `{@debug user}` or `{@debug user1, user2, user3}` logs on changes, pauses if devtools open
- Accepts comma-separated variable names only (not expressions)
- `{@debug}` without args inserts debugger statement on any state change

### {@render}
- `{@render snippetName(args)}` renders snippet
- Expression can be identifier or any JS expression: `{@render (cool ? coolSnippet : lameSnippet)()}`
- Optional: `{@render children?.()}`

## Async/Await Expressions (5.36+, experimental)
- `await` in top-level `<script>`, `$derived(...)`, or markup (requires `experimental.async: true`)
- Synchronized updates: UI waits for async work before updating
- Multiple independent `await` in markup run in parallel
- `<svelte:boundary pending={<p>Loading...</p>}>{await content()}</svelte:boundary>` shows placeholder on first creation
- `$effect.pending()` detects subsequent async work; `settled()` waits for completion
- Errors bubble to nearest error boundary
- SSR: `import { render } from 'svelte/server'; const { head, body } = await render(App);`
- `fork(...)` API preloads async work: `pending ??= fork(() => { open = true; }); pending?.commit();`