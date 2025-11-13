## Svelte 4 to Svelte 5 Migration

### Prerequisites
- Read Svelte's v5 migration guide
- Commit pending changes
- Identify components with custom behavior/styles
- Use `sv-migrate` CLI tool

### Update Configuration Files

**components.json**: Add `registry` field and new aliases:
```json
{
  "registry": "https://shadcn-svelte.com/registry",
  "aliases": {
    "components": "$lib/components",
    "utils": "$lib/utils",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks",
    "lib": "$lib"
  }
}
```

**tailwind.config.js**: Install and add `tailwindcss-animate` plugin, add sidebar color variables and keyframe animations (accordion-down, accordion-up, caret-blink).

**utils.ts**: Now exports only `cn()` function and utility types (WithoutChild, WithoutChildren, WithElementRef). Remove `flyAndScale` function.

### Update Dependencies
```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D
```

Deprecated packages to remove: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`

### Migrate Components
1. Commit changes: `git commit -m 'before migration'`
2. Run CLI for each component: `npx shadcn-svelte@latest add dialog --overwrite`
3. Review diffs and adjust custom behavior/styles
4. Repeat for all components

### Optional: Gradual Migration
Alias old `bits-ui` version in package.json as `bits-ui-old` to use both versions during migration, updating imports as you go.