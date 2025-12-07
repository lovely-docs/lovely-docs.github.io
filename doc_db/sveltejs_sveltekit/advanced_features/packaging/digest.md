## Building Component Libraries with SvelteKit

Use `@sveltejs/package` to build component libraries. Structure: `src/lib` is public-facing (unlike apps where `src/routes` is public), `src/routes` can be docs/demo, `package.json` is published.

The `svelte-package` command generates a `dist` directory containing:
- All files from `src/lib` (Svelte components preprocessed, TypeScript transpiled to JavaScript)
- Auto-generated type definitions (`d.ts` files) for Svelte/JS/TS files (requires TypeScript >= 4.0.0)
- Hand-written `d.ts` files copied as-is

### package.json Fields

**name**: Package name on npmjs.com
```json
{ "name": "your-library" }
```

**license**: Use MIT or similar
```json
{ "license": "MIT" }
```

**files**: Include output folder and use `.npmignore` to exclude tests/unused modules
```json
{ "files": ["dist"] }
```

**exports**: Define entry points with export conditions (`types` for TypeScript, `svelte` for Svelte tooling, `default` for non-Svelte projects)
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    },
    "./Foo.svelte": {
      "types": "./dist/Foo.svelte.d.ts",
      "svelte": "./dist/Foo.svelte"
    }
  }
}
```
Users import as: `import { Something } from 'your-library'` or `import Foo from 'your-library/Foo.svelte'`

**svelte**: Legacy field for backwards compatibility, point to root entry point
```json
{ "svelte": "./dist/index.js" }
```

**sideEffects**: Mark files with side effects (CSS always has side effects for webpack compatibility)
```json
{ "sideEffects": ["**/*.css", "./dist/sideEffectfulFile.js"] }
```

### TypeScript

Auto-generated type definitions by default. For non-root exports, TypeScript won't resolve `types` condition by default. Two solutions:
1. Require consumers to set `moduleResolution` to `bundler` (TS 5+), `node16`, or `nodenext` in tsconfig
2. Use `typesVersions` field to map types:
```json
{
  "exports": { "./foo": { "types": "./dist/foo.d.ts", "svelte": "./dist/foo.js" } },
  "typesVersions": { ">4.0": { "foo": ["./dist/foo.d.ts"] } }
}
```

### Best Practices

- Avoid SvelteKit-specific modules like `$app/environment`; use `esm-env` instead or pass values as props
- Add aliases via `svelte.config.js` (not vite.config.js or tsconfig.json)
- Treat removal of `exports` paths or conditions as breaking changes
- Enable declaration maps with `"declarationMap": true` in tsconfig, include `src/lib` in `files` for source maps

### svelte-package Options

```
-w/--watch              watch src/lib for changes
-i/--input              input directory (default: src/lib)
-o/--output             output directory (default: dist)
-p/--preserve-output    don't delete output before packaging
-t/--types              generate d.ts files (default: true)
--tsconfig              path to tsconfig/jsconfig
```

### Publishing

```sh
npm publish
```

### Caveats

- All relative imports must be fully specified with extensions: `import { x } from './something/index.js'`
- TypeScript imports must use `.js` extension, not `.ts`
- Non-Svelte/TypeScript files copied as-is