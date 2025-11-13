## Breaking Changes Overview

**Global Changes:**
- `el` prop → `ref` prop (all components rendering HTML elements)
- `asChild` prop → `child` snippet
- `transition` props removed (use `child` snippet with `forceMount` and Svelte transitions)
- `let:` directives → snippet props (`children`/`child`)

**Accordion:**
- `multiple` prop removed → use required `type` prop (`'single'` | `'multiple'`)

**Alert Dialog:**
- `transition` props removed
- `AlertDialog.Content` must be wrapped in `AlertDialog.Portal`
- `AlertDialog.Action` no longer closes dialog by default

**Button:**
- `builders` prop removed → use `child` snippet

**Checkbox:**
- `Checkbox.Indicator` removed → use `children` snippet for `checked` state
- `Checkbox.Input` removed → hidden input auto-rendered when `name` prop provided
- `checked` type: `boolean | 'indeterminate'` → `boolean` (indeterminate is separate state)
- New `Checkbox.Group` component added

**Combobox:**
- `multiple` prop removed → use required `type` prop
- `selected` prop → `value` prop
- `Combobox.ItemIndicator` removed → use `children` snippet
- `Combobox.Group` and `Combobox.GroupHeading` added
- Auto-portalling removed → wrap with `Combobox.Portal` component

**Context/Dropdown/Menubar Menu:**
- `*Menu.RadioIndicator` and `*Menu.CheckboxIndicator` removed → use `children` snippet
- `*Menu.Label` → `*Menu.GroupHeading`
- `href` prop removed → use `child` snippet with anchor element
- Auto-portalling removed → wrap with `*Menu.Portal` component

**Pin Input:**
- Completely overhauled for OTP input use case

**Popover:**
- Auto-portalling removed → wrap with `Popover.Portal` component

**Radio Group:**
- `RadioGroup.ItemIndicator` removed → use `children` snippet

**Scroll Area:**
- `ScrollArea.Content` removed

**Select:**
- `multiple` prop removed → use required `type` prop
- `selected` prop → `value` prop
- `Select.ItemIndicator` removed → use `children` snippet
- `Select.Group` and `Select.GroupHeading` added
- `Select.Value` removed → use `value` prop to render custom label
- Auto-portalling removed → wrap with `Select.Portal` component

**Slider:**
- `type` prop now required (`'single'` | `'multiple'`)
- New `onValueCommit` callback for value changes on user interaction completion

**Tooltip:**
- New required `Tooltip.Provider` component (replaces `group` prop)