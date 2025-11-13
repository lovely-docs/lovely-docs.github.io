## $derived

Declare reactive derived state that updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by()` for complex derivations with function bodies. Derived values can be temporarily overridden for optimistic UI. Destructuring creates reactive variables for each property. Svelte uses push-pull reactivity: changes notify dependents immediately but derived values only recalculate when read.