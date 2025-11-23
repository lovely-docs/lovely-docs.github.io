## Purpose
The `components.json` file configures your project for the shadcn-svelte CLI. It's optional and only required when using the CLI to add components; not needed for copy-paste method.

## Initialization
Create the file by running:
```bash
npx shadcn-svelte@latest init
```

## Configuration Options

### $schema
Reference the JSON schema for validation:
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

### tailwind
Configures Tailwind CSS setup for the CLI.

**tailwind.css**: Path to the CSS file importing Tailwind CSS
```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

**tailwind.baseColor**: Generates the default color palette. Cannot be changed after initialization. Options: `gray`, `neutral`, `slate`, `stone`, `zinc`
```json
{
  "tailwind": {
    "baseColor": "gray"
  }
}
```

### aliases
Path aliases must be set up in `svelte.config.js`. The CLI uses these to place generated components correctly.

- **aliases.lib**: Import alias for library code (typically `$lib`)
- **aliases.utils**: Import alias for utility functions (typically `$lib/utils`)
- **aliases.components**: Import alias for components (typically `$lib/components`)
- **aliases.ui**: Import alias for UI components (typically `$lib/components/ui`)
- **aliases.hooks**: Import alias for hooks/reactive functions (typically `$lib/hooks`)

```json
{
  "aliases": {
    "lib": "$lib",
    "utils": "$lib/utils",
    "components": "$lib/components",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks"
  }
}
```

### typescript
Enable or disable TypeScript:
```json
{
  "typescript": true
}
```

Specify a custom TypeScript config file:
```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

### registry
Specifies where the CLI fetches components from. Can pin to a preview release or custom fork:
```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```