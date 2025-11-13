## Store Functions

**writable** - Create a store with both read and write capabilities:
```js
const count = writable(0);
count.subscribe(value => console.log(value));
count.set(1);
count.update(n => n + 1);
```

**readable** - Create a read-only store with optional start/stop callbacks:
```js
const time = readable(new Date(), set => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});
```

**derived** - Create a store computed from one or more source stores:
```js
const doubled = derived(count, $count => $count * 2);
// Or with manual control:
const sum = derived([a, b], ([$a, $b], set) => {
  set($a + $b);
});
```

**get** - Retrieve current store value synchronously:
```js
const value = get(myStore);
```

**readonly** - Wrap a store to expose only its read interface:
```js
const readOnly = readonly(writableStore);
```

**fromStore** - Convert a store to a reactive object with `.current` property (for use in component scripts):
```js
const obj = fromStore(myStore);
console.log(obj.current);
```

**toStore** - Convert getter/setter functions into a store:
```js
const store = toStore(() => value, (v) => { value = v; });
```

## Interfaces

**Readable** - Base interface with `subscribe(run, invalidate?)` method for listening to value changes.

**Writable** - Extends Readable with `set(value)` and `update(updater)` methods.

**StartStopNotifier** - Callback signature for store initialization, receives `set` and `update` functions, optionally returns cleanup function.

**Subscriber** - Callback that receives updated values: `(value) => void`

**Updater** - Callback for transforming values: `(value) => newValue`

**Unsubscriber** - Function to stop listening: `() => void`