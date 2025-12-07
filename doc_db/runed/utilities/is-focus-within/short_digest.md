Reactively tracks focus state within a container element via `IsFocusWithin` class. Constructor takes a getter returning the container element, `current` property exposes boolean focus state.

```ts
const focusWithin = new IsFocusWithin(() => formElement);
console.log(focusWithin.current); // boolean
```