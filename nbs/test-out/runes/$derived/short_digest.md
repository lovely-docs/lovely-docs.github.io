## $derived

Declare derived state that automatically updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

For complex derivations, use `$derived.by(() => { ... })`. Expressions must be side-effect free.

You can temporarily override derived values for optimistic UI. Derived values are not deeply reactive proxies like `$state`. Svelte uses push-pull reactivity: updates notify dependents immediately but derived values only re-evaluate when read.