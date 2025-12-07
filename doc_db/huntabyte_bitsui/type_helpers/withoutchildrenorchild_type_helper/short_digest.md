Type helper to exclude `child` and `children` props from a component. Useful for custom wrappers that manage children internally.

```svelte
type Props = WithoutChildrenOrChild<Accordion.TriggerProps & { title: string }>;
```