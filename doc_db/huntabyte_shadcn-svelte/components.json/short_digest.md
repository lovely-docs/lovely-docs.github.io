## Configuration File for CLI
Create with `npx shadcn-svelte@latest init`. Optional, only needed for CLI component installation.

**Key sections:**
- **$schema**: `https://shadcn-svelte.com/schema.json`
- **tailwind.css**: Path to Tailwind CSS import file
- **tailwind.baseColor**: Default palette (gray/neutral/slate/stone/zinc) - immutable after init
- **aliases**: Path aliases for lib, utils, components, ui, hooks (must match svelte.config.js)
- **typescript**: Enable/disable or specify custom config path
- **registry**: Component registry URL (default: `https://shadcn-svelte.com/registry`)