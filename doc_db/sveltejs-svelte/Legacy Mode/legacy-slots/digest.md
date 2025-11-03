## Slot Basics

In legacy mode, content inside component tags is slotted content, rendered using `<slot>`:

```svelte
<!-- App.svelte -->
<Modal>This is some slotted content</Modal>

<!-- Modal.svelte -->
<div class="modal">
  <slot></slot>
</div>
```

To render a literal `<slot>` element, use `<svelte:element this={'slot'} />`.

## Named Slots

Components can have multiple named slots. Parent side uses `slot="name"` attribute:

```svelte
<!-- App.svelte -->
<Modal>
  Default content
  <div slot="buttons">
    <button>close</button>
  </div>
</Modal>

<!-- Modal.svelte -->
<div class="modal">
  <slot></slot>
  <slot name="buttons"></slot>
</div>
```

## Fallback Content

Define default content inside `<slot>` when no slotted content is provided:

```svelte
<slot>
  This renders if no content provided
</slot>
```

## Passing Data to Slots

Slots can pass values back to parent using props. Parent exposes values with `let:` directive:

```svelte
<!-- FancyList.svelte -->
<ul>
  {#each items as data}
    <li>
      <slot item={process(data)} />
    </li>
  {/each}
</ul>

<!-- App.svelte -->
<FancyList {items} let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

Named slots can also expose values using `let:` on the element with `slot` attribute:

```svelte
<!-- FancyList.svelte -->
<slot name="item" item={process(data)} />
<slot name="footer" />

<!-- App.svelte -->
<FancyList {items}>
  <div slot="item" let:item>{item.text}</div>
  <p slot="footer">Copyright (c) 2019</p>
</FancyList>
```

Shorthand: `let:item` equals `let:item={item}`, and `<slot {item}>` equals `<slot item={item}>`.