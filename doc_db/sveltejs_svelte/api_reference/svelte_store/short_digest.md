## Core Store Functions

- **writable(initial)** - Read/write store with `.set()` and `.update()`
- **readable(initial, start)** - Read-only store with optional lifecycle callback
- **derived(sources, fn)** - Computed store from one or more sources
- **get(store)** - Get current value synchronously
- **readonly(store)** - Make a store read-only
- **fromStore(store)** - Convert store to reactive `.current` property
- **toStore(get, set?)** - Convert getter/setter to store

All stores use `.subscribe(callback)` to listen for changes. Subscribers return an unsubscribe function.