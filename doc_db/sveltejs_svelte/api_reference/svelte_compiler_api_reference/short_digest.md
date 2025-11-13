## Core Functions

- **compile(source, options)** - Converts `.svelte` to JavaScript module
- **compileModule(source, options)** - Compiles JavaScript with runes
- **parse(source, options)** - Returns component AST (modern or legacy format)
- **preprocess(source, preprocessor)** - Transforms component source via hooks
- **migrate(source, options)** - Auto-migrates code to runes/render tags
- **VERSION** - Current version string

## Key Options

`compile()` options: `name`, `customElement`, `generate` ('client'|'server'|false), `dev`, `css` ('injected'|'external'), `runes` (true|false|undefined), `namespace`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `hmr`, `modernAst`

## Preprocessors

`PreprocessorGroup` with `markup`, `script`, `style` preprocessors. Each receives `{content, attributes, markup, filename}` and returns `{code, map?, dependencies?, attributes?}`

## AST Types

`Root` contains `fragment`, `css`, `instance`, `module`, `comments`, `options`. Includes element types (Component, RegularElement, SvelteComponent, etc.), block types (EachBlock, IfBlock, AwaitBlock, KeyBlock, SnippetBlock), tag types (ExpressionTag, HtmlTag, ConstTag, DebugTag, RenderTag), and directive types (BindDirective, OnDirective, ClassDirective, StyleDirective, TransitionDirective, UseDirective, AnimateDirective, LetDirective)

## Result

`CompileResult`: `{js: {code, map}, css: {code, map, hasGlobal}|null, warnings: [], metadata: {runes}, ast}`