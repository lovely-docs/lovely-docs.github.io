## Registry Item JSON Schema

Registry items define reusable components, styles, themes, and blocks for shadcn-svelte projects. Each item is a JSON object with metadata and file references.

### Core Properties

**name**: Unique identifier (e.g., "hello-world")

**type**: Item classification:
- `registry:block` - Complex components with multiple files
- `registry:component` - Simple single components
- `registry:ui` - UI primitives
- `registry:lib` - Libraries/utilities
- `registry:hook` - Hooks
- `registry:page` - Routes
- `registry:file` - Miscellaneous files
- `registry:style` - Styles (e.g., "new-york")
- `registry:theme` - Themes

**title**, **description**: Human-readable metadata

**files**: Array of file objects with `path` (registry location), `type`, and optional `target` (installation location):
```json
{
  "files": [
    {
      "path": "registry/hello-world/page.svelte",
      "type": "registry:page",
      "target": "src/routes/hello/+page.svelte"
    },
    {
      "path": "registry/hello-world/hello-world.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/.env",
      "type": "registry:file",
      "target": ".env"
    }
  ]
}
```

**dependencies**: npm packages (use `@version` for specific versions):
```json
{ "dependencies": ["bits-ui", "zod@3.0.0"] }
```

**registryDependencies**: Other registry items (names, URLs, or local paths):
```json
{ "registryDependencies": ["button", "input", "https://example.com/r/custom.json"] }
```

**cssVars**: CSS variables organized by theme sections:
```json
{
  "cssVars": {
    "theme": { "font-heading": "Poppins, sans-serif" },
    "light": { "brand": "20 14.3% 4.1%", "radius": "0.5rem" },
    "dark": { "brand": "20 14.3% 4.1%" }
  }
}
```

**css**: CSS rules added to project CSS file:
```json
{
  "css": {
    "@layer base": { "h1": { "font-size": "var(--text-2xl)" } },
    "@layer components": { "card": { "padding": "var(--spacing-6)" } },
    "@utility content-auto": { "content-visibility": "auto" },
    "@keyframes wiggle": { "0%, 100%": { "transform": "rotate(-3deg)" } }
  }
}
```

**docs**: Custom message shown during CLI installation

**categories**: Organize items by category (e.g., `["sidebar", "dashboard"]`)

**meta**: Additional key/value metadata

### Style & Theme Examples

**Extending shadcn-svelte style:**
```json
{
  "name": "example-style",
  "type": "registry:style",
  "dependencies": ["phosphor-svelte"],
  "registryDependencies": ["login-01", "calendar"],
  "cssVars": {
    "theme": { "font-sans": "Inter, sans-serif" },
    "light": { "brand": "oklch(0.145 0 0)" },
    "dark": { "brand": "oklch(0.145 0 0)" }
  }
}
```

**Custom theme:**
```json
{
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.546 0.245 262.881)"
    },
    "dark": {
      "background": "oklch(1 0 0)",
      "primary": "oklch(0.707 0.165 254.624)"
    }
  }
}
```

**Block with dependencies:**
```json
{
  "name": "login-01",
  "type": "registry:block",
  "description": "A simple login form.",
  "registryDependencies": ["button", "card", "input", "label"],
  "files": [
    {
      "path": "blocks/login-01/page.svelte",
      "type": "registry:page",
      "target": "src/routes/login/+page.svelte"
    },
    {
      "path": "blocks/login-01/components/login-form.svelte",
      "type": "registry:component"
    }
  ]
}
```

## registry.json Schema

Root registry configuration file defining the registry itself.

**$schema**: `https://shadcn-svelte.com/schema/registry.json`

**name**: Registry identifier (used in data attributes)

**homepage**: Registry URL

**items**: Array of registry items (each follows registry-item schema)

**aliases**: Maps internal import paths to actual locations. Transformed during installation based on user's `components.json`:
```json
{
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "components": "@/lib/registry/components",
    "utils": "@/lib/utils",
    "hooks": "@/lib/hooks"
  }
}
```

Default aliases if not specified:
```json
{
  "aliases": {
    "lib": "$lib/registry/lib",
    "ui": "$lib/registry/ui",
    "components": "$lib/registry/components",
    "utils": "$lib/utils",
    "hooks": "$lib/registry/hooks"
  }
}
```

**overrideDependencies**: Force specific dependency versions (overrides `package.json` detection):
```json
{ "overrideDependencies": ["paneforge@next"] }
```

## Setting Up a Registry

Create `registry.json` in project root:
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

Create component file at `registry/hello-world/hello-world.svelte`:
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button>Hello World</Button>
```

Add to `registry.json`:
```json
{
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "./src/lib/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

For custom component directories, ensure Tailwind CSS detects them via `@source` in `src/app.css`:
```css
@source "./registry/@acmecorp/ui-lib";
```

### Build & Serve

Install CLI: `npm install shadcn-svelte@latest`

Add to `package.json`:
```json
{ "scripts": { "registry:build": "shadcn-svelte registry build" } }
```

Run: `npm run registry:build` (generates JSON in `static/r/` by default, customizable with `--output`)

Serve: `npm run dev` - registry available at `http://localhost:5173/r/[NAME].json`

### Publishing & Authentication

Deploy to public URL. For token-based auth, use query parameter: `http://localhost:5173/r/hello-world.json?token=[SECURE_TOKEN_HERE]`. Handle authorization on server, return 401 for invalid tokens. Encrypt and expire tokens.

### Installing Registry Items

`npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json -y -o`

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Guidelines

- Required block properties: `name`, `description`, `type`, `files`
- List all registry dependencies in `registryDependencies`
- Organize files in `components`, `hooks`, `lib` directories
- Use registry template at GitHub for new projects