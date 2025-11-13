## Creating a Custom Component Registry

You can use the CLI to create your own component registry to distribute custom components, hooks, pages, and other files to any Svelte project. Registry items are automatically compatible with the shadcn-svelte CLI.

### Requirements

Registry items must be valid JSON files conforming to the registry-item schema specification. You can use the official template project as a starting point:

```bash
pnpm dlx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```

You are free to design and host your registry as you see fit, as long as items meet the schema requirements.