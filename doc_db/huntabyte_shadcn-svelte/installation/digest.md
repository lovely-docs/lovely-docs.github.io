## Installation Guides

Multiple setup paths available: SvelteKit, Astro, Vite, or Manual installation.

## Component Structure & Imports

Unlike shadcn/ui for React, components are split across multiple files because Svelte doesn't support multiple components per file. The CLI creates a folder for each component with an `index.ts` barrel export.

Example: Accordion component split into 4 files:
- `accordion.svelte`
- `accordion-content.svelte`
- `accordion-item.svelte`
- `accordion-trigger.svelte`

Import options:
```ts
import * as Accordion from '$lib/components/ui/accordion'
// or
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion'
```

Components are tree-shaken by Rollup, so unused exports don't bloat the bundle.

## IDE Extensions

**VSCode**: shadcn-svelte extension by @selemondev provides:
- CLI initialization
- Component addition
- Documentation navigation
- Import/markup snippets

**JetBrains IDEs**: shadcn/ui Components Manager by @WarningImHack3r supports:
- Auto-detect shadcn/ui components
- Add/remove/update with one click
- Works with Svelte, React, Vue, Solid
- Search remote or existing components