## mergeProps

Utility function to merge multiple props objects. Used internally by Bits UI to merge custom `restProps` with component-provided props.

### Event Handlers
Chained in order. If a handler calls `event.preventDefault()`, subsequent handlers don't execute:

```ts
const props1 = { onclick: (e) => console.log("First") };
const props2 = { onclick: (e) => { console.log("Second"); e.preventDefault(); } };
const props3 = { onclick: (e) => console.log("Third") };
const merged = mergeProps(props1, props2, props3);
merged.onclick(new MouseEvent("click")); // Logs: "First" then "Second" only
```

### Non-Event Handler Functions
Chained without cancellation ability:

```ts
const merged = mergeProps(
  { doSomething: () => console.log("Action 1") },
  { doSomething: () => console.log("Action 2") }
);
merged.doSomething(); // Logs: "Action 1" then "Action 2"
```

### Classes
Merged using clsx:

```ts
const merged = mergeProps(
  { class: "text-lg font-bold" },
  { class: ["bg-blue-500", "hover:bg-blue-600"] }
);
// Result: "text-lg font-bold bg-blue-500 hover:bg-blue-600"
```

### Styles
Objects and strings merged, later properties override earlier ones:

```ts
const merged = mergeProps(
  { style: { color: "red", fontSize: "16px" } },
  { style: "background-color: blue; font-weight: bold;" }
);
// Result: "color: red; font-size: 16px; background-color: blue; font-weight: bold;"
```