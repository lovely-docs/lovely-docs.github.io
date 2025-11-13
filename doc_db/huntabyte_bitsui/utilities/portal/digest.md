## Portal Component

A utility component that renders children in a portal, preventing layout issues in complex UI structures.

### Default Behavior
By default, Portal renders children to the `body` element:
```svelte
<Portal>
  <div>This content will be portalled to the body</div>
</Portal>
```

### Custom Target
Use the `to` prop to specify a custom target element or selector:
```svelte
<div id="custom-target"></div>
<Portal to="#custom-target">
  <div>This content will be portalled to the #custom-target element</div>
</Portal>
```

### Disable Portal Behavior
Use the `disabled` prop to render content in its original DOM location:
```svelte
<Portal disabled>
  <div>This content will not be portalled</div>
</Portal>
```

### Override Default Target
Use `BitsConfig` with `defaultPortalTo` prop to change the default target for all Portal components in scope:
```svelte
<BitsConfig defaultPortalTo={target}>
  <section>
    <Portal>
      <!-- Content lifted out of section and made child of {target} -->
    </Portal>
  </section>
</BitsConfig>
```

### API Reference
- `to` (Element | string): Where to render content. Defaults to `document.body`
- `disabled` (boolean): When true, renders content in original DOM location. Default: false
- `children` (Snippet): The content to render