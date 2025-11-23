## Installation

Multiple framework guides: SvelteKit, Astro, Vite, Manual.

## Component Structure

Components split into multiple `.svelte` files with barrel export via `index.ts`. Import via namespace or named imports—both tree-shaken:
```ts
import * as Accordion from '$lib/components/ui/accordion'
import { Accordion, AccordionContent } from '$lib/components/ui/accordion'
```

## IDE Extensions

VSCode (shadcn-svelte) and JetBrains (shadcn/ui Components Manager) extensions available for component management and documentation navigation.