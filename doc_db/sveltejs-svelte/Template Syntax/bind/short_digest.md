## Two-way Data Binding with `bind:`

Syntax: `bind:property={expression}` or `bind:property` when identifier matches property name.

**Input bindings:** `bind:value` (coerces to number for type="number"|"range"), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox groups), `bind:files`

**Select:** `bind:value` binds to selected option value (any type); `<select multiple>` binds to array

**Media:** `<audio>`/`<video>` two-way: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

**Other:** `<img>` (readonly `naturalWidth`, `naturalHeight`), `<details bind:open>`, contenteditable (`innerHTML`, `innerText`, `textContent`), dimensions (readonly: `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`), `bind:this` for DOM references

**Components:** Use `$bindable()` rune to mark props as bindable: `let { prop = $bindable() } = $props()`

**Function bindings:** `bind:value={get, set}` for validation; set `get` to `null` for readonly bindings