

## Pages

### bits-config
Context provider for centralized default props (defaultPortalTo, defaultLocale) with scoped inheritance and component-level override support.

## BitsConfig

Global context provider for setting default props across all Bits UI components within its scope.

### Key Features
- **Scoped defaults**: Applies only to components within its scope
- **Inheritance**: Child instances inherit parent values and can override them
- **Fallback resolution**: Automatically resolves values through config hierarchy

### Basic Usage
```svelte
<script lang="ts">
  import { BitsConfig, Dialog, DateField } from "bits-ui";
</script>
<BitsConfig defaultPortalTo="#modal-root" defaultLocale="es">
  <Dialog.Root>
    <Dialog.Trigger>Open Dialog</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Content>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog content here</Dialog.Description>
        <DateField.Root><!-- ... --></DateField.Root>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</BitsConfig>
```

### Inheritance & Overrides
Child configs inherit parent values and can selectively override:
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
        <Dialog.Content>
          Nested dialog
          <DateField.Root><!-- inherits "de" locale --></DateField.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </BitsConfig>
</BitsConfig>
```

### Real-world Examples

**Global defaults in root layout:**
```svelte
<script lang="ts">
  import { BitsConfig } from "bits-ui";
  import { locale } from "$lib/states/i18n.svelte.js";
  let { children } = $props();
</script>
<BitsConfig defaultPortalTo="body" defaultLocale={locale.current}>
  {@render children()}
</BitsConfig>
```

**Theme-specific configuration with different portal targets:**
```svelte
<div id="header-portals"></div>
<div id="sidebar-portals"></div>
<div id="main-portals"></div>
<header>
  <BitsConfig defaultPortalTo="#header-portals">
    <MyHeader />
  </BitsConfig>
</header>
<aside>
  <BitsConfig defaultPortalTo="#sidebar-portals">
    <MySidebar />
  </BitsConfig>
</aside>
<main>
  <BitsConfig defaultPortalTo="#main-portals">
    <MyContent />
  </BitsConfig>
</main>
```

**Route-specific locales:**
```svelte
<BitsConfig defaultLocale="en">
  {@render children()}
</BitsConfig>
```

### Component-level Overrides
Individual components override global defaults:
```svelte
<BitsConfig defaultPortalTo="#main-portal">
  <Dialog.Root>
    <Dialog.Portal>
      <Dialog.Content>Uses #main-portal</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  <Dialog.Root>
    <Dialog.Portal to="#special-portal">
      <Dialog.Content>Uses #special-portal</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</BitsConfig>
```

### Value Resolution Order
1. Direct component prop
2. Nearest parent BitsConfig
3. Inherited from parent BitsConfig(s)
4. Built-in component default (portals default to `"body"`, locales default to `"en"`)

### API Reference

| Property          | Type                 | Description                                          | Default         |
| ----------------- | -------------------- | ---------------------------------------------------- | --------------- |
| `defaultPortalTo` | Element \| string    | Where to render content when open                    | document.body   |
| `defaultLocale`   | string               | Default locale for the app                           | en              |
| `children`        | Snippet              | Children content to render                           | undefined       |

### is-using-keyboard
IsUsingKeyboard utility tracks keyboard activity via global shared state; instantiate and read `.current` property for boolean keyboard usage status.

## IsUsingKeyboard

A utility component that tracks whether the user is actively using the keyboard. Used internally by Bits UI components to provide keyboard accessibility features.

Provides global state shared across all instances to prevent duplicate event listener registration.

### Usage

```svelte
import { IsUsingKeyboard } from "bits-ui";
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```

Access the current keyboard usage state via the `current` property.

### mergeprops
Merges props objects with event handler chaining (preventDefault stops chain), function chaining, clsx class merging, and style object/string merging with override semantics.

## mergeProps

Utility function to merge multiple props objects. Used internally by Bits UI to merge custom `restProps` with component-provided props.

### Key Features
- Merges multiple props objects
- Chains event handlers with cancellation support
- Combines class names
- Merges style objects and strings
- Chains non-event handler functions

### Event Handlers

Event handlers are chained in order. If a handler calls `event.preventDefault()`, subsequent handlers are not executed.

```ts
const props1 = { onclick: (e: MouseEvent) => console.log("First click") };
const props2 = { onclick: (e: MouseEvent) => console.log("Second click") };
const mergedProps = mergeProps(props1, props2);
mergedProps.onclick(new MouseEvent("click")); // Logs: "First click" then "Second click"
```

With `preventDefault()`:

```ts
const props1 = { onclick: (e: MouseEvent) => console.log("First click") };
const props2 = {
  onclick: (e: MouseEvent) => {
    console.log("Second click");
    e.preventDefault();
  },
};
const props3 = { onclick: (e: MouseEvent) => console.log("Third click") };
const mergedProps = mergeProps(props1, props2, props3);
mergedProps.onclick(new MouseEvent("click")); // Logs: "First click" then "Second click" only
```

### Non-Event Handler Functions

Non-event handler functions are chained without cancellation ability:

```ts
const props1 = { doSomething: () => console.log("Action 1") };
const props2 = { doSomething: () => console.log("Action 2") };
const mergedProps = mergeProps(props1, props2);
mergedProps.doSomething(); // Logs: "Action 1" then "Action 2"
```

### Classes

Class names merged using clsx:

```ts
const props1 = { class: "text-lg font-bold" };
const props2 = { class: ["bg-blue-500", "hover:bg-blue-600"] };
const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.class); // "text-lg font-bold bg-blue-500 hover:bg-blue-600"
```

### Styles

Style objects and strings merged, with later properties overriding earlier ones:

```ts
const props1 = { style: { color: "red", fontSize: "16px" } };
const props2 = { style: "background-color: blue; font-weight: bold;" };
const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.style);
// "color: red; font-size: 16px; background-color: blue; font-weight: bold;"

const props1 = { style: "--foo: red" };
const props2 = { style: { "--foo": "green", color: "blue" } };
const mergedProps = mergeProps(props1, props2);
console.log(mergedProps.style); // "--foo: green; color: blue;"
```

### portal
Portal component renders children to specified DOM location (body by default) via `to` prop; disable with `disabled` prop; configure default target via BitsConfig's `defaultPortalTo`.

## Portal Component

Utility component that renders children in a portal, preventing layout issues in complex UI structures.

### Default Behavior
By default, Portal renders children to the `body` element:
```svelte
<script lang="ts">
  import { Portal } from "bits-ui";
</script>
<Portal>
  <div>This content will be portalled to the body</div>
</Portal>
```

### Custom Target
Use the `to` prop to specify a custom target element or selector:
```svelte
<Portal to="#custom-target">
  <div>This content will be portalled to the #custom-target element</div>
</Portal>
```

### Disable Portal Behavior
Use the `disabled` prop to prevent portalling:
```svelte
<Portal disabled>
  <div>This content will not be portalled</div>
</Portal>
```

### Override Default Target
Use `BitsConfig` component's `defaultPortalTo` prop to change the default target for all Portal components in scope:
```svelte
<script lang="ts">
  import { Portal, BitsConfig } from "bits-ui";
  let target: HTMLElement | undefined = $state();
</script>
<BitsConfig defaultPortalTo={target}>
  <div bind:this={target} class="bg-background flex rounded-md border p-2">
    <section class="flex size-12 items-center justify-center bg-blue-200">
      <Portal>
        <div class="size-12 bg-blue-600"></div>
      </Portal>
    </section>
  </div>
</BitsConfig>
```

### API Reference

**Portal** - Renders children to a different DOM location.

| Property   | Type                 | Description |
| ---------- | -------------------- | ----------- |
| `to`       | Element \| string    | Where to render content. Defaults to `document.body` |
| `disabled` | boolean              | When true, renders content in original DOM location. Default: `false` |
| `children` | Snippet              | Content to render |

### useid
useId() generates unique IDs for element association; used internally by all components, exposed for public use.

## useId

Utility function to generate unique IDs, used internally by all Bits UI components and exposed for public use.

### Usage

```svelte
import { useId } from "bits-ui";
const id = useId();
```

Apply the generated ID to elements:
```svelte
<label for={id}>Label here</label>
<input {id} />
```

The function returns a unique identifier string suitable for associating form labels with inputs and other elements requiring unique identifiers.

