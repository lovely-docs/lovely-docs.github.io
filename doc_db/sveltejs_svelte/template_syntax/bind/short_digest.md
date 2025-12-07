## Two-way data binding with `bind:`

Enables child-to-parent data flow. Syntax: `bind:property={expression}` or `bind:property` if names match.

**Input bindings:** `bind:value` (coerces numbers), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox groups), `bind:files` (FileList via DataTransfer).

**Select:** `bind:value` for single/multiple selections; omit value attribute if it matches text content.

**Media:** `<audio>`/`<video>` two-way: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`.

**Other:** `<img>` readonly `naturalWidth`/`naturalHeight`; `<details bind:open>`; contenteditable `innerHTML`/`innerText`/`textContent`; dimension bindings (readonly, ResizeObserver-measured).

**`bind:this`** - DOM/component references (undefined until mounted).

**Component props:** Mark with `$bindable()` rune; can have fallback values (only when unbound).

**Function bindings:** `bind:property={get, set}` for validation/transformation; set get to `null` for readonly.