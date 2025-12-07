Reactive state manager with automatic browser storage persistence and cross-tab synchronization. Supports localStorage/sessionStorage, connection control, and custom serialization. Plain objects/arrays are deeply reactive; class instances require full replacement to persist.

```ts
const count = new PersistedState("count", 0, {
  storage: "local",    // or 'session'
  syncTabs: true,      // sync across tabs
  connected: true,     // auto-persist
  serializer: { serialize, deserialize } // custom types
});
count.current++; // auto-persists
state.connect() / state.disconnect(); // manual control
```