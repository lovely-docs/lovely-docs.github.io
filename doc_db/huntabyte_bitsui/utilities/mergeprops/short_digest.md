Merges multiple props objects with special handling: event handlers chain with preventDefault() cancellation support, non-event functions chain without cancellation, class names merge via clsx, and styles merge with later values overriding earlier ones.

```ts
mergeProps(
  { onclick: () => console.log("1"), class: "text-lg", style: { color: "red" } },
  { onclick: () => console.log("2"), class: "font-bold", style: "background: blue" }
);
// Event handlers chain, classes merge, styles merge with overrides
```