## BitsConfig
Global context provider for setting default props (portal target, locale) across components with inheritance and override support.

**Properties:**
- `defaultPortalTo` (Element | string): Default portal target, defaults to `document.body`
- `defaultLocale` (string): Default locale, defaults to `"en"`
- `children` (Snippet): Content to render

**Value resolution order:** Direct component prop → Nearest parent BitsConfig → Inherited from parent BitsConfig(s) → Built-in default

```svelte
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="de">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Main dialog</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <BitsConfig defaultPortalTo="#tooltip-portal">
    <!-- Inherits locale="de", uses new portal target -->
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </BitsConfig>
</BitsConfig>
```

## IsUsingKeyboard
Tracks whether the user is actively using the keyboard with global state shared across instances.

```svelte
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```

## mergeProps
Merges props objects with special handling for event handlers (with preventDefault support), functions, classes, and styles.

**Event handlers** chain in order; if a handler calls `event.preventDefault()`, subsequent handlers don't execute:
```ts
const merged = mergeProps(
  { onclick: (e) => console.log("First") },
  { onclick: (e) => { console.log("Second"); e.preventDefault(); } },
  { onclick: (e) => console.log("Third") }
);
merged.onclick(new MouseEvent("click")); // Logs: "First" then "Second" only
```

**Non-event functions** chain without cancellation. **Classes** merge using clsx. **Styles** merge as objects/strings with later properties overriding earlier ones.

## Portal
Renders children in a portal to prevent layout issues, with customizable target and disable options.

```svelte
<Portal to="#custom-target">
  <div>Portalled to #custom-target</div>
</Portal>

<Portal disabled>
  <div>Rendered in original DOM location</div>
</Portal>
```

**API:** `to` (Element | string), `disabled` (boolean), `children` (Snippet)

## useId
Generates unique IDs for components and form elements.

```svelte
const id = useId();
<label for={id}>Label</label>
<input {id} />
```