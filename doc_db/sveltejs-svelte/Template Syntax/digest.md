
## Markup & Attributes

Tags are HTML (lowercase) or components (capitalized/dot). Attributes support JavaScript expressions with shorthand syntax:
```svelte
<button disabled={!clickable}>
<button {disabled}>
<Widget a="b" {...spread} c="d" />
```

Boolean attributes are included if truthy. Text interpolation uses braces—null/undefined omitted, others stringified:
```svelte
<h1>Hello {name}!</h1>
{@html rawHtml}  <!-- Sanitize to prevent XSS -->
```

Events use `on:` prefix and are case-sensitive. Use `svelte/events` `on` function to avoid `stopPropagation` issues. HTML comments work; `svelte-ignore` disables warnings.

## Control Flow

**Conditionals** with chaining:
```svelte
{#if temp > 100}
  <p>too hot</p>
{:else if temp > 80}
  <p>too cold</p>
{:else}
  <p>just right</p>
{/if}
```

**Iteration** with optional keying and destructuring:
```svelte
{#each items as item, i (item.id)}
  <li>{i + 1}: {item.name}</li>
{/each}
{#each { length: n } as _, i}  <!-- Render n times -->
{#each items as item}...{:else}empty{/each}
```

**Async** branching on Promise states (pending omitted in SSR):
```svelte
{#await promise}
  loading...
{:then value}
  {value}
{:catch error}
  {error.message}
{/await}
```

**Key block** destroys and recreates contents on expression change (reinitialize components, replay transitions):
```svelte
{#key value}
  <Component />
{/key}
```

## Snippets & Rendering

Reusable markup blocks declared with parameters:
```svelte
{#snippet header()}header content{/snippet}
{#snippet row(data)}row for {data.name}{/snippet}
```

Render with `{@render}` or pass to components:
```svelte
{@render header()}
{@render optional?.()}  <!-- Optional chaining -->
<Table {header} {row} />  <!-- Explicit -->
<Table>
  {#snippet header()}...{/snippet}
  {#snippet row(d)}...{/snippet}
</Table>  <!-- Implicit -->
```

Type with `Snippet<[ParamType]>`:
```svelte
let { row }: { row: Snippet<[any]> } = $props();
```

Nested component content becomes `children` snippet prop. Export snippets from `<script module>` if not referencing non-module declarations.

## Two-Way Data Binding

**Directive** `bind:property={expr}` or shorthand `bind:property`:

Input bindings auto-coerce type="number"|"range" to number, `bind:checked` for checkboxes, `bind:group` for radio/checkbox groups, `bind:files` for file inputs:
```svelte
<input bind:value={name}>
<input type="checkbox" bind:checked={checked}>
<input type="radio" bind:group={selected} value={option}>
<input type="file" bind:files>
```

**Select** binding: `bind:value` for single option (any type) or `bind:value` to array on `<select multiple>`:
```svelte
<select bind:value={selected}><option>{item}</option></select>
<select multiple bind:value={items}></select>
```

**Media controls** `<audio>`/`<video>`: two-way `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`.

**Other targets**: `<img>` readonly `naturalWidth`/`naturalHeight`, `<details bind:open>`, contenteditable (`innerHTML`, `innerText`, `textContent`), readonly dimensions (`clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`), `bind:this` for DOM element references.

**Component props** marked bindable with `$bindable()`:
```svelte
let { count = $bindable(0) } = $props();
```

**Function binding** for validation:
```svelte
bind:value={{
  get: () => value,
  set: (v) => value = validate(v)
}}
bind:value={{ get: null, set: (v) => { } }}  <!-- Readonly -->
```

## Styling & Classes

**Classes** with object/array syntax (Svelte 5.16+) or legacy directive:
```svelte
<div class={{ active, disabled: !enabled }}>
<div class={[faded && 'saturate-0', large && 'scale-200']}>
<div class:active={bool}>  <!-- Legacy -->
```

**Inline styles** with `style:` directive:
```svelte
<div style:color="red" style:width={w} style:background-color|important={bg}>
```

Takes precedence over `style` attributes and `!important`.

## Directives

**use:** attaches action functions on mount with setup/teardown via `$effect`:
```svelte
function myaction(node, data) {
  $effect(() => {
    setup();
    return () => { teardown(); };
  });
}
<div use:myaction={data}></div>
```

Type with `Action<NodeType, ParamType, EventHandlers>`. Actions don't re-run on argument changes.

**transition:** bidirectional animations on element enter/exit DOM:
```svelte
<div transition:fade>
<div transition:fade|global={{ duration: 2000 }}>
```

Custom transitions return object with `duration`, `easing`, and `css(t, u)` or `tick(t, u)`:
```js
function whoosh(node, params) {
  return {
    duration: 400,
    css: (t, u) => `transform: scale(${t})`
  };
}
```

Events: `introstart`, `introend`, `outrostart`, `outroend`.

**in:/out:** non-bidirectional transitions (in continues during outro, doesn't reverse):
```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade></div>
{/if}
```

**animate:** triggers on reordering in keyed `#each` blocks (not on add/remove):
```svelte
{#each list as item (item.id)}
  <li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

Custom animation function receives node and `{ from, to }` DOMRects, returns object with `delay`, `duration`, `easing`, `css` or `tick`:
```js
function whizz(node, { from, to }, params) {
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  return {
    duration: Math.sqrt(dx*dx + dy*dy) * 120,
    css: (t, u) => `transform: translate(${u*dx}px, ${u*dy}px) rotate(${t*360}deg);`
  };
}
```

Prefer `css` over `tick` for performance (off main thread).

## Utility Tags

**{@const}** defines local constants in block scope (immediate child of blocks, components, `<svelte:boundary>`):
```svelte
{#each boxes as box}
  {@const area = box.width * box.height}
  {area}
{/each}
```

**{@debug}** logs variable changes, pauses with devtools open (comma-separated names only, not expressions):
```svelte
{@debug user, count}
{@debug}  <!-- Triggers on any state change -->
```

**{@attach}** reactive functions running when elements mount or state updates with optional cleanup:
```svelte
function myAttachment(element) {
  return () => console.log('cleanup');
}
<div {@attach myAttachment}></div>
```

Attachment factories return attachments for reusable patterns. Can define inline with nested effects. Passed to components as Symbol-keyed props.

**Comments** `<!-- -->` work, `@component` shows documentation on hover in IDEs.
