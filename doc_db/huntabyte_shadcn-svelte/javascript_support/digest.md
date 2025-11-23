shadcn-svelte is written in TypeScript, but JavaScript versions of components are available through the CLI. To use JavaScript instead of TypeScript, set `"typescript": false` in `components.json`:

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

Configure import aliases by creating `jsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

TypeScript is recommended for the project, but JavaScript support is provided as an alternative.