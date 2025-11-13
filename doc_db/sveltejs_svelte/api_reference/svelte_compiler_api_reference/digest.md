## Main Functions

**compile(source, options)** - Converts `.svelte` source code into a JavaScript module exporting a component. Returns `CompileResult` with `js`, `css`, `warnings`, `metadata`, and `ast` properties.

**compileModule(source, options)** - Compiles JavaScript source code containing runes into a JavaScript module. Always operates in runes mode.

**parse(source, options)** - Parses a component and returns its abstract syntax tree. Supports both modern and legacy AST formats via the `modern` option (defaults to `false` in Svelte 5, will default to `true` in Svelte 6).

**preprocess(source, preprocessor, options)** - Applies preprocessor hooks to transform component source code. Accepts single or array of `PreprocessorGroup` objects. Returns a `Promise<Processed>`.

**migrate(source, options)** - Performs best-effort migration of Svelte code to use runes, event attributes, and render tags. Accepts optional `filename` and `use_ts` options.

**VERSION** - String constant of the current version from package.json.

## Key Compile Options

- `name` - Sets the resulting JavaScript class name (inferred from filename if unspecified)
- `customElement` - Generate custom element constructor instead of regular component
- `generate` - `'client'` (default), `'server'`, or `false` for no output
- `dev` - Add runtime checks and debugging info
- `css` - `'injected'` (default) or `'external'` for CSS handling
- `runes` - Force runes mode (`true`), disable it (`false`), or infer (`undefined`)
- `namespace` - Element namespace like `'html'`, `'svg'`, `'mathml'`
- `preserveComments` - Keep HTML comments in output
- `preserveWhitespace` - Keep whitespace as typed
- `fragments` - `'html'` (default) or `'tree'` for DOM fragment cloning strategy
- `hmr` - Enable hot module reloading support
- `modernAst` - Return modern AST format

## Preprocessor System

`PreprocessorGroup` contains optional `markup`, `script`, and `style` preprocessors. Each preprocessor receives `content`, `attributes`, `markup`, and `filename`, returning `Processed` with `code`, optional `map`, `dependencies`, and `attributes`.

## AST Structure

The `AST` namespace provides TypeScript types for the parsed component tree including:
- `Root` - Top-level node with `fragment`, `css`, `instance`, `module`, `comments`, and `options`
- Element types: `Component`, `RegularElement`, `SlotElement`, `TitleElement`, special Svelte elements (`SvelteComponent`, `SvelteElement`, `SvelteFragment`, `SvelteBoundary`, etc.)
- Block types: `EachBlock`, `IfBlock`, `AwaitBlock`, `KeyBlock`, `SnippetBlock`
- Tag types: `ExpressionTag`, `HtmlTag`, `ConstTag`, `DebugTag`, `RenderTag`, `AttachTag`
- Directive types: `BindDirective`, `OnDirective`, `ClassDirective`, `StyleDirective`, `TransitionDirective`, `UseDirective`, `AnimateDirective`, `LetDirective`

## Return Types

`CompileResult` contains:
- `js` - Object with `code` (string) and `map` (SourceMap)
- `css` - Null or object with `code`, `map`, and `hasGlobal` boolean
- `warnings` - Array of warning objects with `code`, `message`, `start`, `end`
- `metadata` - Object with `runes` boolean indicating compilation mode
- `ast` - The parsed AST