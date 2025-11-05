## Building Component Libraries

Use `@sveltejs/package` to build component libraries. Structure: `src/lib` is public-facing, `src/routes` is optional documentation/demo, `package.json` is used for publishing.

Running `svelte-package` generates a `dist` directory containing:
- All files from `src/lib` (Svelte components preprocessed, TypeScript transpiled to JavaScript)
- Auto-generated type definitions (`d.ts` files) for all files

## package.json Configuration

**name** — Package name on npm
```json
{ "name": "your-library" }
```

**license** — Recommended: `MIT`

**files** — Which files npm publishes (should include `dist`)
```json
{ "files": ["dist"] }
```

**exports** — Entry points for the package
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    }
  }
}
```

The `types` condition points to type definitions, `svelte` condition indicates Svelte component library. You can define multiple entry points:
```json
{
  "exports": {
    "./Foo.svelte": {
      "types": "./dist/Foo.svelte.d.ts",
      "svelte": "./dist/Foo.svelte"
    }
  }
}
```

**svelte** — Legacy field for backwards compatibility, points to root entry point

**sideEffects** — Helps bundlers with tree-shaking. Mark CSS files as having side effects for webpack compatibility:
```json
{ "sideEffects": ["**/*.css"] }
```

## TypeScript

Type definitions are auto-generated. For non-root exports, TypeScript won't resolve the `types` condition by default. Solutions:
1. Require consumers to set `moduleResolution` to `bundler`, `node16`, or `nodenext` in their tsconfig
2. Use `typesVersions` field to map types:
```json
{
  "exports": { "./foo": { "types": "./dist/foo.d.ts", "svelte": "./dist/foo.js" } },
  "typesVersions": { ">4.0": { "foo": ["./dist/foo.d.ts"] } }
}
```

## Best Practices

- Avoid SvelteKit-specific modules like `$app/environment`. Use `esm-env` instead or pass values as props
- Define aliases in `svelte.config.js`, not `vite.config.js` or `tsconfig.json`
- Treat removal of export paths or conditions as breaking changes
- Enable declaration maps with `"declarationMap": true` in tsconfig and include `src/lib` in `files` array for source navigation

## Source Maps

Create declaration maps (`d.ts.map` files) for editor "Go to Definition" support:
```json
{
  "files": ["dist", "!dist/**/*.test.*", "src/lib", "!src/lib/**/*.test.*"]
}
```

## svelte-package Options

- `-w`/`--watch` — Watch for changes
- `-i`/`--input` — Input directory (default: `src/lib`)
- `-o`/`--output` — Output directory (default: `dist`)
- `-p`/`--preserve-output` — Don't delete output before packaging
- `-t`/`--types` — Generate type definitions (default: `true`)
- `--tsconfig` — Path to tsconfig/jsconfig

## Publishing

```sh
npm publish
```

## Caveats

- All relative imports must be fully specified with file extensions per Node's ESM algorithm: `import { x } from './something/index.js'`
- TypeScript imports must use `.js` extension, not `.ts`
- Non-Svelte and non-TypeScript files are copied as-is