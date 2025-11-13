shadcn-svelte is written in TypeScript, but JavaScript versions of components are available through the CLI.

To use JavaScript instead of TypeScript, set `"typescript": false` in `components.json`:

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

For import aliases in JavaScript projects, create a `jsconfig.json` file:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```