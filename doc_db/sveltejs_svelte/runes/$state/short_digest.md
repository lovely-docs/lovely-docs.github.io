## Core
`$state` creates reactive state that updates the UI. Plain values stay plain; arrays/objects become deeply reactive proxies.

```svelte
let count = $state(0);
<button onclick={() => count++}>clicks: {count}</button>
```

## Proxies & Destructuring
Nested properties trigger granular updates. Destructuring breaks reactivity:
```js
let todos = $state([{ done: false }]);
todos[0].done = true; // reactive
let { done } = todos[0]; // done is not reactive
```

## Classes
Use `$state` on fields; compiler creates get/set methods. Watch `this` context in event handlers:
```js
class Todo { done = $state(false); }
<button onclick={() => todo.reset()}>reset</button> // correct
```

## Variants
- `$state.raw`: Non-reactive, reassign-only, better performance
- `$state.snapshot`: Static snapshot of proxy for external libraries
- `$state.eager`: Immediate UI updates in `await` expressions

## Passing State
Pass-by-value: functions receive current value, not reactive reference. Use functions/getters for reactive access:
```js
let a = $state(1);
add(a, b); // passes value 1
add(() => a, () => b); // passes getters for current values
```

## Cross-Module Export
Can't export directly reassigned state (compiler limitation). Either update properties or use getter functions:
```js
export const counter = $state({ count: 0 }); // OK
export function getCount() { return count; } // OK
```