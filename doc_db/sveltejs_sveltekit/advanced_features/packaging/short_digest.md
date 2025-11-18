## Building Component Libraries

Use `@sveltejs/package` to build libraries with `src/lib` as public-facing code. Running `svelte-package` generates `dist` with preprocessed components and auto-generated type definitions.

## package.json Fields

- **exports** - Define entry points with `types` and `svelte` conditions
- **files** - Specify what to publish, typically `["dist"]`
- **license**, **name** - Standard npm fields
- **svelte** - Legacy field pointing to root entry point
- **sideEffects** - Mark CSS as having side effects: `["**/*.css"]`

## TypeScript

Type definitions auto-generate. For non-root exports, use `typesVersions` to map types or require consumers to set `"moduleResolution": "bundler"` in tsconfig.

## Best Practices

- Avoid SvelteKit-specific modules; use `esm-env` instead
- Add aliases via `svelte.config.js`
- Removing exports is a breaking change
- Use fully specified imports with extensions: `import { x } from './something/index.js'`
- For TypeScript, import `.ts` files with `.js` extension