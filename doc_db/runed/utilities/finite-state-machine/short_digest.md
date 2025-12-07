Strongly-typed FSM with states, events, and transitions. Define state→event→state mappings. Supports action functions for conditional logic, `_enter`/`_exit` lifecycle hooks, wildcard `"*"` fallback handlers, and `debounce()` for delayed transitions.

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: { toggle: "on", _enter: () => {} },
	on: { toggle: "off" },
	"*": { emergency: "off" }
});
f.send("toggle");
f.debounce(5000, "toggle");
```