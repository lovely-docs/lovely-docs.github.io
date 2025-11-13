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