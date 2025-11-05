## Building Component Libraries

Use `@sveltejs/package` to build libraries with `src/lib` as public-facing code. Generates `dist` with preprocessed components and auto-generated type definitions.

## package.json Configuration

**exports** — Define entry points with `types` and `svelte` conditions:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js" },
    "./Foo.svelte": { "types": "./dist/Foo.svelte.d.ts", "svelte": "./dist/Foo.svelte" }
  }
}
```

**files** — Include `dist` folder
**license** — Recommended: `MIT`
**sideEffects** — Mark CSS as having side effects: `["**/*.css"]`

## TypeScript

Type definitions auto-generate. For non-root exports, use `typesVersions` to map types:
```json
{
  "typesVersions": { ">4.0": { "foo": ["./dist/foo.d.ts"] } }
}
```

## Best Practices

- Avoid SvelteKit-specific modules; use `esm-env` or pass values as props
- Define aliases in `svelte.config.js`
- Removing export paths/conditions is a breaking change
- Enable declaration maps for source navigation

## Caveats

- All relative imports need full paths with extensions: `import { x } from './something/index.js'`
- TypeScript imports use `.js` extension, not `.ts`