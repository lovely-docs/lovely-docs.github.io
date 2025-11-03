## $derived

Declare derived state that automatically updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

For complex logic, use `$derived.by(() => { ... })`. Expressions must be side-effect free.

Can temporarily override derived values for optimistic UI. Unlike `$state`, derived values aren't deeply reactive proxies, but mutations to objects/arrays from reactive state still affect the source.

Uses push-pull reactivity: dependents are notified immediately, but derived values only re-evaluate when read. Skips downstream updates if the new value is referentially identical to the previous one.