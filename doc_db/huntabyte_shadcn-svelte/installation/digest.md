## Installation Guides

Installation instructions are provided for multiple frameworks:
- SvelteKit
- Astro
- Vite
- Manual setup

## Component Structure & Imports

Unlike the React version, components are split into multiple files because Svelte doesn't support multiple components per file. The CLI creates a folder for each component containing individual `.svelte` files and an `index.ts` barrel export.

Example: Accordion component structure:
```
accordion/
  ├── accordion.svelte
  ├── accordion-content.svelte
  ├── accordion-item.svelte
  ├── accordion-trigger.svelte
  └── index.ts
```

Import approaches (both are tree-shaken by Rollup):
```ts
import * as Accordion from '$lib/components/ui/accordion'
// or
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion'
```

## IDE Extensions

**VSCode**: Install shadcn-svelte extension by @selemondev
- Initialize CLI
- Add components
- Navigate to component documentation
- Component import snippets

**JetBrains IDEs**: Install shadcn/ui Components Manager by @WarningImHack3r (supports Svelte, React, Vue, Solid)
- Auto-detect components
- Add/remove/update with one click
- Search remote or existing components