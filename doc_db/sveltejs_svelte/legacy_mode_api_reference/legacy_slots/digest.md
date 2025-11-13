## Default Slots

In legacy mode, content inside component tags is slotted content, rendered using `<slot>`:

```svelte
<!-- App.svelte -->
<Modal>This is some slotted content</Modal>

<!-- Modal.svelte -->
<div class="modal">
  <slot></slot>
</div>
```

## Named Slots

Add `slot="..."` attribute on parent side, `<slot name="...">` on child side:

```svelte
<!-- App.svelte -->
<Modal>
  <div slot="buttons">
    <button>close</button>
  </div>
</Modal>

<!-- Modal.svelte -->
<slot></slot>
<slot name="buttons"></slot>
```

## Fallback Content

Define default content inside `<slot>` when no slotted content is provided:

```svelte
<slot>
  This will be rendered if no slotted content is provided
</slot>
```

## Passing Data to Slots

Slots can pass values back to parent using props. Parent exposes values with `let:` directive:

```svelte
<!-- FancyList.svelte -->
<ul>
  {#each items as data}
    <li><slot item={process(data)} /></li>
  {/each}
</ul>

<!-- App.svelte -->
<FancyList {items} let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

Named slots can also expose values with `let:` on the element with `slot` attribute:

```svelte
<!-- FancyList.svelte -->
<slot name="item" item={process(data)} />
<slot name="footer" />

<!-- App.svelte -->
<FancyList {items}>
  <div slot="item" let:item>{item.text}</div>
  <p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```