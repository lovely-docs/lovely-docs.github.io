## BitsConfig

Global context provider for setting default props across all Bits UI components within its scope.

### Key Features
- **Scoped defaults**: Applies only to components within its scope
- **Inheritance**: Child BitsConfig instances inherit parent values and can override them
- **Fallback resolution**: Automatically resolves values through the hierarchy

### Properties
| Property | Type | Default |
|----------|------|---------|
| `defaultPortalTo` | Element \| string | `document.body` |
| `defaultLocale` | string | `"en"` |
| `children` | Snippet | undefined |

### Usage

Set app-wide defaults at root layout:
```svelte
<BitsConfig defaultPortalTo="body" defaultLocale={locale.current}>
  {@render children()}
</BitsConfig>
```

Nested configs inherit and override parent values:
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

Component-level props override config defaults:
```svelte
<BitsConfig defaultPortalTo="#main-portal">
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
4. Built-in component default