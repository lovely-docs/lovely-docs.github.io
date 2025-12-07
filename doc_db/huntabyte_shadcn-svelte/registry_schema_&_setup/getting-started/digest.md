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