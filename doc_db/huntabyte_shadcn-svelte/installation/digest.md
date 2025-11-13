## Installation Guides

Multiple setup paths available: SvelteKit, Astro, Vite, or Manual installation.

## Component Structure & Imports

Components are split into multiple `.svelte` files per component (unlike React's shadcn/ui). Each component folder contains an `index.ts` that exports all subcomponents.

Example - Accordion component structure:
```ts
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "$lib/components/ui/accordion"
```

Components are tree-shaken by Rollup, so unused exports don't bloat the bundle.

## IDE Extensions

**VSCode**: shadcn-svelte extension by @selemondev provides CLI initialization, component addition, documentation navigation, and import snippets.

**JetBrains IDEs**: shadcn/ui Components Manager extension by @WarningImHack3r supports auto-detection, adding/removing/updating components, and works across Svelte, React, Vue, and Solid implementations.