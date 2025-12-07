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