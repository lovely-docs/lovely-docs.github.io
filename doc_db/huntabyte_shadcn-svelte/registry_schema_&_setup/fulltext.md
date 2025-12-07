

## Pages

### registry-examples
Registry item JSON schema examples for styles, themes, blocks, CSS variables, custom CSS layers, utilities, and animations with light/dark mode support.

## Registry Item Examples

Registry items define styles, components, themes, blocks, and CSS customizations for shadcn-svelte projects.

### registry:style

**Extending shadcn-svelte:**
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "example-style",
  "type": "registry:style",
  "dependencies": ["phosphor-svelte"],
  "registryDependencies": ["login-01", "calendar", "https://example.com/r/editor.json"],
  "cssVars": {
    "theme": { "font-sans": "Inter, sans-serif" },
    "light": { "brand": "oklch(0.145 0 0)" },
    "dark": { "brand": "oklch(0.145 0 0)" }
  }
}
```

**From scratch (extends: none):**
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "extends": "none",
  "name": "new-style",
  "type": "registry:style",
  "dependencies": ["tailwind-merge", "clsx"],
  "registryDependencies": ["utils", "https://example.com/r/button.json", "https://example.com/r/input.json", "https://example.com/r/label.json", "https://example.com/r/select.json"],
  "cssVars": {
    "theme": { "font-sans": "Inter, sans-serif" },
    "light": { "main": "#88aaee", "bg": "#dfe5f2", "border": "#000", "text": "#000", "ring": "#000" },
    "dark": { "main": "#88aaee", "bg": "#272933", "border": "#000", "text": "#e6e6e6", "ring": "#fff" }
  }
}
```

### registry:theme

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.546 0.245 262.881)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      "ring": "oklch(0.746 0.16 232.661)",
      "sidebar-primary": "oklch(0.546 0.245 262.881)",
      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
      "sidebar-ring": "oklch(0.746 0.16 232.661)"
    },
    "dark": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.707 0.165 254.624)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      "ring": "oklch(0.707 0.165 254.624)",
      "sidebar-primary": "oklch(0.707 0.165 254.624)",
      "sidebar-primary-foreground": "oklch(0.97 0.014 254.604)",
      "sidebar-ring": "oklch(0.707 0.165 254.624)"
    }
  }
}
```

Custom colors can be added to existing styles:
```json
{
  "name": "custom-style",
  "type": "registry:style",
  "cssVars": {
    "light": { "brand": "oklch(0.99 0.00 0)" },
    "dark": { "brand": "oklch(0.14 0.00 286)" }
  }
}
```

### registry:block

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "login-01",
  "type": "registry:block",
  "description": "A simple login form.",
  "registryDependencies": ["button", "card", "input", "label"],
  "files": [
    {
      "path": "blocks/login-01/page.svelte",
      "content": "import { LoginForm } ...",
      "type": "registry:page",
      "target": "src/routes/login/+page.svelte"
    },
    {
      "path": "blocks/login-01/components/login-form.svelte",
      "content": "...",
      "type": "registry:component"
    }
  ]
}
```

Blocks can override primitives from other registries:
```json
{
  "name": "custom-login",
  "type": "registry:block",
  "registryDependencies": ["login-01", "https://example.com/r/button.json", "https://example.com/r/input.json", "https://example.com/r/label.json"]
}
```

### CSS Variables

**Theme variables:**
```json
{
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "theme": {
      "font-heading": "Inter, sans-serif",
      "shadow-card": "0 0 0 1px rgba(0, 0, 0, 0.1)"
    }
  }
}
```

**Tailwind overrides:**
```json
{
  "cssVars": {
    "theme": {
      "spacing": "0.2rem",
      "breakpoint-sm": "640px",
      "breakpoint-md": "768px",
      "breakpoint-lg": "1024px",
      "breakpoint-xl": "1280px",
      "breakpoint-2xl": "1536px"
    }
  }
}
```

### Custom CSS

**Base styles:**
```json
{
  "name": "custom-style",
  "type": "registry:style",
  "css": {
    "@layer base": {
      "h1": { "font-size": "var(--text-2xl)" },
      "h2": { "font-size": "var(--text-xl)" }
    }
  }
}
```

**Component styles:**
```json
{
  "name": "custom-card",
  "type": "registry:component",
  "css": {
    "@layer components": {
      "card": {
        "background-color": "var(--color-white)",
        "border-radius": "var(--rounded-lg)",
        "padding": "var(--spacing-6)",
        "box-shadow": "var(--shadow-xl)"
      }
    }
  }
}
```

### Custom Utilities

**Simple utility:**
```json
{
  "name": "custom-component",
  "type": "registry:component",
  "css": {
    "@utility content-auto": {
      "content-visibility": "auto"
    }
  }
}
```

**Complex utility with pseudo-elements:**
```json
{
  "css": {
    "@utility scrollbar-hidden": {
      "scrollbar-hidden": {
        "&::-webkit-scrollbar": { "display": "none" }
      }
    }
  }
}
```

**Functional utilities with wildcards:**
```json
{
  "css": {
    "@utility tab-*": {
      "tab-size": "var(--tab-size-*)"
    }
  }
}
```

### Custom Animations

Define both keyframes in `css` and theme variable in `cssVars`:
```json
{
  "name": "custom-component",
  "type": "registry:component",
  "cssVars": {
    "theme": {
      "--animate-wiggle": "wiggle 1s ease-in-out infinite"
    }
  },
  "css": {
    "@keyframes wiggle": {
      "0%, 100%": { "transform": "rotate(-3deg)" },
      "50%": { "transform": "rotate(3deg)" }
    }
  }
}
```

### registry-faq
Registry item structure with multiple file types; custom Tailwind colors and theme variable overrides via cssVars configuration.

## Complex Component Structure

A registry item can include multiple file types in a single installation:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A complex hello world component",
  "files": [
    {
      "path": "registry/hello-world/page.svelte",
      "type": "registry:page",
      "target": "src/routes/hello/+page.svelte"
    },
    {
      "path": "registry/hello-world/components/hello-world.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/components/formatted-message.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/hooks/use-hello.svelte.ts",
      "type": "registry:hook"
    },
    {
      "path": "registry/hello-world/lib/format-date.ts",
      "type": "registry:utils"
    },
    {
      "path": "registry/hello-world/hello.config.ts",
      "type": "registry:file",
      "target": "hello.config.ts"
    }
  ]
}
```

File types include: `registry:page`, `registry:component`, `registry:hook`, `registry:utils`, and `registry:file`. The `target` field specifies where files are installed in the project.

## Adding Tailwind Colors

Add colors to `cssVars` under `light` and `dark` keys:

```json
{
  "cssVars": {
    "light": {
      "brand-background": "20 14.3% 4.1%",
      "brand-accent": "20 14.3% 4.1%"
    },
    "dark": {
      "brand-background": "20 14.3% 4.1%",
      "brand-accent": "20 14.3% 4.1%"
    }
  }
}
```

The CLI updates the project CSS file. Colors become available as utility classes: `bg-brand`, `text-brand-accent`.

## Adding or Overriding Theme Variables

Add theme variables to `cssVars.theme`:

```json
{
  "cssVars": {
    "theme": {
      "text-base": "3rem",
      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      "font-heading": "Poppins, sans-serif"
    }
  }
}
```

Theme variables can override spacing, easing, fonts, and other Tailwind configuration values.

### getting-started
Set up component registry: create registry.json with items (name, type, title, description, files), build with CLI, serve locally or deploy publicly, optionally add token-based auth.

## Setting up a component registry

Create a `registry.json` file in your project root:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": []
}
```

### Add a component

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

Each registry item requires: `name`, `type`, `title`, `description`, `files`. For each file, specify `path` (relative from project root) and `type`.

If placing components in custom directories, ensure Tailwind CSS can detect them via `@source` in `src/app.css`:

```css
@source "./registry/@acmecorp/ui-lib";
```

### Build and serve

Install CLI: `npm i shadcn-svelte@latest`

Add to `package.json`:

```json
{
  "scripts": {
    "registry:build": "shadcn-svelte registry build"
  }
}
```

Run: `npm run registry:build` (generates JSON files in `static/r/` by default, customizable with `--output`)

Serve: `npm run dev` - registry available at `http://localhost:5173/r/[NAME].json`

### Publishing and authentication

Deploy to public URL to publish. For auth, use query parameter approach: `http://localhost:5173/r/hello-world.json?token=[SECURE_TOKEN_HERE]`. Handle authorization on server, return 401 for invalid tokens. Encrypt and expire tokens.

### Install registry items

`npx shadcn-svelte@latest add http://localhost:5173/r/hello-world.json`

### Guidelines

- Required block properties: `name`, `description`, `type`, `files`
- List all registry dependencies in `registryDependencies` (component names or URLs)
- Organize files in `components`, `hooks`, `lib` directories
- Use registry template at GitHub for new projects (already configured)

### registry-item.json_schema
JSON schema specification for registry items with properties for name, type, files, dependencies, CSS variables, and metadata.

## registry-item.json Schema

JSON schema for defining custom registry items in shadcn-svelte.

### Basic Structure

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A simple hello world component.",
  "files": [
    {
      "path": "registry/hello-world/hello-world.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/use-hello-world.svelte.ts",
      "type": "registry:hook"
    }
  ],
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "20 14.3% 4.1%"
    },
    "dark": {
      "brand": "20 14.3% 4.1%"
    }
  }
}
```

### Properties

**$schema**: URL to the schema definition (https://shadcn-svelte.com/schema/registry-item.json)

**name**: Unique identifier for the item (e.g., "hello-world")

**title**: Human-readable title, short and descriptive (e.g., "Hello World")

**description**: Longer, detailed description of the item

**type**: Specifies the item type:
- `registry:block` - Complex components with multiple files
- `registry:component` - Simple components
- `registry:lib` - Libraries and utilities
- `registry:hook` - Hooks
- `registry:ui` - UI components and single-file primitives
- `registry:page` - Page or file-based routes
- `registry:file` - Miscellaneous files
- `registry:style` - Registry styles (e.g., "new-york")
- `registry:theme` - Themes

**author**: Author of the item (e.g., "John Doe <john@doe.com>")

**dependencies**: Array of npm package dependencies, use `@version` for specific versions:
```json
{
  "dependencies": ["bits-ui", "zod", "@lucide/svelte", "name@1.0.2"]
}
```

**registryDependencies**: Array of other registry items this depends on. Can be:
- shadcn-svelte item names: `["button", "input", "select"]`
- Remote URLs: `["https://example.com/r/hello-world.json"]`
- Local aliases (CLI only): `["local:stepper"]` → converts to `["./stepper.json"]`
- Relative paths: `["./stepper.json"]`

**files**: Array of file objects with properties:
- `path`: Path to file in registry (used by build script)
- `type`: File type (see type section above)
- `target`: Where file should be placed in project (required for `registry:page` and `registry:file`). Use `~` for project root (e.g., `~/foo.config.js`)

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

**cssVars**: Define CSS variables organized by theme sections:
```json
{
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "20 14.3% 4.1%",
      "radius": "0.5rem"
    },
    "dark": {
      "brand": "20 14.3% 4.1%"
    }
  }
}
```

**css**: Add CSS rules to project's CSS file:
```json
{
  "css": {
    "@layer base": {
      "body": {
        "font-size": "var(--text-base)",
        "line-height": "1.5"
      }
    },
    "@layer components": {
      "button": {
        "background-color": "var(--color-primary)",
        "color": "var(--color-white)"
      }
    },
    "@utility text-magic": {
      "font-size": "var(--text-base)",
      "line-height": "1.5"
    },
    "@keyframes wiggle": {
      "0%, 100%": {
        "transform": "rotate(-3deg)"
      },
      "50%": {
        "transform": "rotate(3deg)"
      }
    }
  }
}
```

**docs**: Custom documentation or message shown during CLI installation:
```json
{
  "docs": "Remember to add the FOO_BAR environment variable to your .env file."
}
```

**categories**: Organize items by categories:
```json
{
  "categories": ["sidebar", "dashboard"]
}
```

**meta**: Additional metadata as key/value pairs:
```json
{
  "meta": { "foo": "bar" }
}
```

### registry.json_schema
registry.json schema for custom component registries: defines name, homepage, items array, path aliases for import transformation, and dependency version overrides.

## registry.json Schema

Defines the structure for custom component registries in shadcn-svelte.

### Core Properties

**$schema**: Points to the schema definition at `https://shadcn-svelte.com/schema/registry.json`

**name**: Registry identifier used for data attributes and metadata
```json
{ "name": "acme" }
```

**homepage**: Registry URL for metadata
```json
{ "homepage": "https://acme.com" }
```

**items**: Array of registry items, each implementing the registry-item schema. Example:
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
          "path": "src/lib/registry/blocks/hello-world/hello-world.svelte",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

### aliases

Maps internal import paths to their actual locations. When users install components, these paths are transformed according to their `components.json` configuration.

Example registry with internal imports:
```svelte
<script lang="ts">
  import { Button } from "@/lib/registry/ui/button/index.js";
  import { cn } from "@/lib/utils.js";
</script>
```

Matching aliases in registry.json:
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

Default aliases (if not specified):
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

### overrideDependencies

Forces specific version ranges for dependencies, overriding what `shadcn-svelte registry build` detects in `package.json`. Use cases: pre-release versions or pinning to specific versions.

Example:
```json
{
  "overrideDependencies": ["paneforge@next"]
}
```

When user installs, `paneforge@next` (latest pre-release) is used instead of the version in your package.json.

**Warning**: Can cause version conflicts if not carefully managed; use sparingly.

