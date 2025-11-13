

## Pages

### bitsconfig
Global context provider for setting default props (portal target, locale) across Bits UI components with inheritance and override support.

Global context provider for default props across Bits UI components.

**Properties**: `defaultPortalTo` (Element | string, default: body), `defaultLocale` (string, default: "en")

**Inheritance**: Child configs inherit parent values and can override them.

**Example**:
```svelte
<BitsConfig defaultPortalTo="body" defaultLocale="en">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Uses body portal, en locale</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <BitsConfig defaultPortalTo="#tooltip-portal">
    <!-- Inherits locale, uses new portal -->
    <Tooltip.Root>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>Uses #tooltip-portal, en locale</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </BitsConfig>
</BitsConfig>
```

**Resolution order**: Direct prop → Nearest parent BitsConfig → Inherited parent → Built-in default

### isusingkeyboard
Utility to track whether the user is actively using the keyboard, with global state shared across instances.

Utility component that tracks active keyboard usage via global shared state. Access current state with `isUsingKeyboard.current`.

```svelte
import { IsUsingKeyboard } from "bits-ui";
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```

### mergeprops
Utility to merge props objects with special handling for event handlers (with preventDefault support), functions, classes, and styles.

## mergeProps

Merges multiple props objects with special handling:

- **Event handlers**: Chained in order; `preventDefault()` stops subsequent handlers
- **Non-event functions**: Chained without cancellation
- **Classes**: Merged via clsx
- **Styles**: Objects and strings merged; later values override earlier ones

```ts
const merged = mergeProps(
  { onclick: (e) => { console.log("1"); e.preventDefault(); } },
  { onclick: (e) => console.log("2") } // Won't execute
);
```

### portal
Utility component that renders children in a portal to prevent layout issues, with customizable target and disable options.

## Portal Component

Renders children to a different DOM location (default: body) to prevent layout issues.

**Props:**
- `to` - Target element or selector (default: `document.body`)
- `disabled` - Disable portal behavior (default: false)
- `children` - Content to render

**Examples:**
```svelte
<Portal to="#custom-target">
  <div>Content</div>
</Portal>

<Portal disabled>
  <div>Not portalled</div>
</Portal>

<BitsConfig defaultPortalTo={target}>
  <Portal><!-- Uses custom default --></Portal>
</BitsConfig>
```

### useid
A utility function that generates unique IDs for use in components and form elements.

## useId

Generates unique IDs. Import from "bits-ui" and call to get an ID:

```svelte
import { useId } from "bits-ui";
const id = useId();
```

