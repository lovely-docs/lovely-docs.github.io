`WithoutChildrenOrChild` type helper excludes `child` and `children` props from a component, useful for custom wrappers that manage children internally.

```svelte
type WithoutChildrenOrChild<Accordion.TriggerProps & { title: string }>
```