## Creating a Custom Component Registry

The `shadcn-svelte` CLI allows you to create and host your own component registry to distribute custom components, hooks, pages, and other files to any Svelte project. Registry items are automatically compatible with the `shadcn-svelte` CLI.

### Requirements

Registry items must be valid JSON files conforming to the registry-item schema specification. You can design and host your registry however you prefer.

### Getting Started

Clone the official template project as a starting point:

```bash
npx degit huntabyte/shadcn-svelte/registry-template#next-tailwind-4
```

This template provides a complete example of a properly structured registry.