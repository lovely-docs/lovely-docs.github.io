The `components.json` file configures your project for the shadcn-svelte CLI. It's optional and only required when using the CLI to add components; copy-paste method doesn't need it.

Initialize with:
```bash
npx shadcn-svelte@latest init
```

**Key configuration sections:**

- `$schema`: Reference to JSON schema at https://shadcn-svelte.com/schema.json
- `tailwind.css`: Path to CSS file importing Tailwind (e.g., `"src/app.{p,post}css"`)
- `tailwind.baseColor`: Base color palette for components - one of `gray`, `neutral`, `slate`, `stone`, `zinc`. Cannot be changed after initialization.
- `aliases`: Path aliases for imports (must be set in `svelte.config.js`):
  - `lib`: Library root, typically `"$lib"`
  - `utils`: Utility functions, typically `"$lib/utils"`
  - `components`: Components, typically `"$lib/components"`
  - `ui`: UI components, typically `"$lib/components/ui"`
  - `hooks`: Reactive functions/classes, typically `"$lib/hooks"`
- `typescript`: Enable/disable TypeScript (`true`/`false`), or specify custom config path: `{"config": "path/to/tsconfig.custom.json"}`
- `registry`: Registry URL for fetching components, defaults to `"https://shadcn-svelte.com/registry"`