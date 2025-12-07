Resolves either a getter function or static value to a plain value. Handles `undefined` by returning a fallback.

```ts
const interval = $derived(extract(intervalProp, 100));
```

Behavior: static value → returns it; `undefined` → returns fallback; function → calls it and returns result (or fallback if `undefined`).