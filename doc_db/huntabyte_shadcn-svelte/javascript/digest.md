## Using JavaScript Instead of TypeScript

The project is written in TypeScript, but JavaScript versions of components are available via the CLI.

**Disable TypeScript** in `components.json`:
```json
{
  "style": "default",
  "tailwind": {
    "css": "src/app.css"
  },
  "typescript": false,
  "aliases": {
    "utils": "$lib/utils",
    "components": "$lib/components",
    "hooks": "$lib/hooks",
    "ui": "$lib/components/ui"
  },
  "registry": "https://shadcn-svelte.com/registry"
}
```

**Configure import aliases** in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```