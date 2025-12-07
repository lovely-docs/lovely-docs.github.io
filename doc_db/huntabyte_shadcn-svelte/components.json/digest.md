## Overview
The `components.json` file configures your project for the shadcn-svelte CLI. It's optional and only required when using the CLI to add components; not needed for copy-paste method.

Create it with:
```bash
npx shadcn-svelte@latest init
```

## Configuration Options

**$schema**: Reference the JSON schema at `https://shadcn-svelte.com/schema.json`
```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

**tailwind.css**: Path to your Tailwind CSS import file
```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

**tailwind.baseColor**: Sets the default color palette (cannot be changed after initialization)
```json
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
```

**aliases**: Path aliases for organizing generated components. Must be configured in `svelte.config.js`:
- `lib`: Library root (typically `$lib`)
- `utils`: Utility functions (typically `$lib/utils`)
- `components`: All components (typically `$lib/components`)
- `ui`: UI components (typically `$lib/components/ui`)
- `hooks`: Svelte 5 reactive functions/classes (typically `$lib/hooks`)

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

**typescript**: Enable/disable TypeScript or specify custom config path
```json
{
  "typescript": true | false
}
```
```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

**registry**: URL for fetching components (can pin to preview release or custom fork)
```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```