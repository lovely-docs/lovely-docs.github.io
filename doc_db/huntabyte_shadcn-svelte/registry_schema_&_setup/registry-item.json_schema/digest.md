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