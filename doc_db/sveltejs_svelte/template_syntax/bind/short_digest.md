## Two-way binding with `bind:`

Enables data flow from child to parent. Syntax: `bind:property={expression}` or `bind:property` if names match.

**Input bindings:** `bind:value` (coerces to number), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox groups), `bind:files`

**Select:** `bind:value` on `<select>` or `<select multiple>` (returns array)

**Media:** `<audio>`/`<video>` two-way: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

**Other:** `<img>` readonly dimensions, `<details bind:open>`, contenteditable `innerHTML`/`innerText`/`textContent`, element dimensions (`clientWidth`, `offsetHeight`, etc.)

**Function bindings (5.9.0+):** `bind:value={() => value, (v) => value = v.toLowerCase()}`

**Component props:** Mark with `$bindable()` rune, then use `bind:property={variable}` on component instances

**bind:this:** Get DOM/component references