## mergeProps

Merges multiple props objects with special handling:

- **Event handlers**: Chained in order; `preventDefault()` stops subsequent handlers
- **Non-event functions**: Chained without cancellation
- **Classes**: Merged via clsx
- **Styles**: Objects and strings merged; later values override earlier ones

```ts
const merged = mergeProps(
  { onclick: (e) => { console.log("1"); e.preventDefault(); } },
  { onclick: (e) => console.log("2") } // Won't execute
);
```