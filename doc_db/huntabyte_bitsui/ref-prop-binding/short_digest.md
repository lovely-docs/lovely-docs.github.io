## Ref Prop Binding

Bind `ref` to access underlying HTML elements for DOM manipulation:

```svelte
let triggerRef = $state<HTMLButtonElement | null>(null);
<Accordion.Trigger bind:ref={triggerRef}>Content</Accordion.Trigger>
```

With child snippets, pass custom IDs to the parent component:

```svelte
<Accordion.Trigger bind:ref={triggerRef} id={myCustomId}>
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

Use `WithElementRef` type helper to create custom ref props in your components.