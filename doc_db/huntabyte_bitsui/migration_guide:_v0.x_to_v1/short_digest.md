## Key Migration Changes

**Global:** `el` → `ref`, `asChild` → `child` snippet, remove `transition` props, `let:` → snippet props

**Type Props:** Accordion, Combobox, Select, Slider now require `type` prop (`'single'`/`'multiple'`)

**Removed Indicators:** Checkbox, Combobox, Select, Radio, Menu indicators removed → use `children` snippet

**Portalling:** Combobox, Select, Popover, Menu, Alert Dialog now use explicit `*.Portal` wrapper (auto-portalling removed)

**Other:** Checkbox `checked` type is now `boolean` only, Slider adds `onValueCommit`, Tooltip requires `Tooltip.Provider`, Pin Input completely overhauled