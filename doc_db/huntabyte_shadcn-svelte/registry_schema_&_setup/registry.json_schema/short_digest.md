**registry.json** defines custom component registries with properties: `$schema`, `name`, `homepage`, `items` (array of registry items), `aliases` (path transformations for imports), and `overrideDependencies` (force specific dependency versions).

Example with aliases:
```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "aliases": {
    "lib": "@/lib",
    "ui": "@/lib/registry/ui",
    "utils": "@/lib/utils"
  },
  "items": [...]
}
```

Default aliases use `$lib/registry/*` paths. `overrideDependencies` can force pre-release versions like `["paneforge@next"]`.