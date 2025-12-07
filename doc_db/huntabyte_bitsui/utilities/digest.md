## BitsConfig
Global context provider for setting default props across all components within its scope. Supports scoped defaults with inheritance and component-level overrides.

**Key features:**
- Scoped defaults apply only to components within scope
- Child configs inherit parent values and can override them
- Value resolution order: direct component prop → nearest parent BitsConfig → inherited from parent BitsConfig(s) → built-in component default

**Properties:**
- `defaultPortalTo` (Element | string): Where to render content when open, defaults to document.body
- `defaultLocale` (string): Default locale for the app, defaults to "en"
- `children` (Snippet): Children content to render

**Example:**
```svelte
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="de">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Main dialog</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <BitsConfig defaultPortalTo="#tooltip-portal">
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
    <Dialog.Root>
      <Dialog.Portal>
        <Dialog.Content>Nested dialog (inherits "de" locale)</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </BitsConfig>
</BitsConfig>
```

Individual components override global defaults via direct props (e.g., `<Dialog.Portal to="#special-portal">`).

## IsUsingKeyboard
Utility component that tracks whether the user is actively using the keyboard via global shared state. Prevents duplicate event listener registration across instances.

**Usage:**
```svelte
import { IsUsingKeyboard } from "bits-ui";
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```

Access current keyboard usage state via the `current` property.

## mergeProps
Utility function to merge multiple props objects with event handler chaining, class name combining, and style merging.

**Key features:**
- Chains event handlers in order; if a handler calls `event.preventDefault()`, subsequent handlers are not executed
- Non-event handler functions are chained without cancellation ability
- Class names merged using clsx
- Style objects and strings merged with later properties overriding earlier ones

**Examples:**
```ts
// Event handlers with preventDefault
const props1 = { onclick: (e) => console.log("First") };
const props2 = { onclick: (e) => { console.log("Second"); e.preventDefault(); } };
const props3 = { onclick: (e) => console.log("Third") };
const merged = mergeProps(props1, props2, props3);
merged.onclick(new MouseEvent("click")); // Logs: "First" then "Second" only

// Classes
const merged = mergeProps(
  { class: "text-lg font-bold" },
  { class: ["bg-blue-500", "hover:bg-blue-600"] }
);
// Result: "text-lg font-bold bg-blue-500 hover:bg-blue-600"

// Styles
const merged = mergeProps(
  { style: { color: "red", fontSize: "16px" } },
  { style: "background-color: blue; font-weight: bold;" }
);
// Result: "color: red; font-size: 16px; background-color: blue; font-weight: bold;"
```

## Portal
Utility component that renders children to a specified DOM location (body by default).

**Properties:**
- `to` (Element | string): Where to render content, defaults to document.body
- `disabled` (boolean): When true, renders content in original DOM location, default false
- `children` (Snippet): Content to render

**Usage:**
```svelte
<Portal>
  <div>Portalled to body</div>
</Portal>

<Portal to="#custom-target">
  <div>Portalled to #custom-target</div>
</Portal>

<Portal disabled>
  <div>Not portalled</div>
</Portal>
```

Default target can be changed via BitsConfig's `defaultPortalTo` prop.

## useId
Utility function to generate unique IDs for element association, used internally by all components and exposed for public use.

**Usage:**
```svelte
import { useId } from "bits-ui";
const id = useId();
```

Apply to elements:
```svelte
<label for={id}>Label here</label>
<input {id} />
```

Returns a unique identifier string suitable for associating form labels with inputs and other elements requiring unique identifiers.