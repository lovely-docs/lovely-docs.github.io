## Compiler API

**Functions**: `compile(source, options)` converts `.svelte` to JS module; `compileModule(source, options)` compiles JS with runes; `parse(source, options)` returns AST; `preprocess(source, preprocessor)` transforms source; `migrate(source, options)` auto-migrates to runes.

**CompileOptions**: `name`, `customElement`, `accessors`, `namespace`, `immutable`, `css` ('injected'|'external'), `cssHash`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `runes`, `discloseVersion`, `compatibility.componentApi`, `sourcemap`, `outputFilename`, `cssOutputFilename`, `hmr`, `modernAst`.

**ModuleCompileOptions**: `dev`, `generate` ('client'|'server'|false), `filename`, `rootDir`, `warningFilter`, `experimental.async`.

**CompileResult**: `{ js: { code, map }, css: { code, map, hasGlobal } | null, warnings, metadata: { runes }, ast }`.

**Preprocessors**: `PreprocessorGroup` with `markup`, `style`, `script` functions; each takes `{ content, attributes?, markup?, filename? }` and returns `Processed` with `{ code, map?, dependencies?, attributes?, toString? }`.

**AST**: Comprehensive types for Root, Fragment, Text, ExpressionTag, HtmlTag, Comment, ConstTag, DebugTag, RenderTag, AttachTag, Elements (Component, RegularElement, SvelteBody, etc.), Blocks (EachBlock, IfBlock, AwaitBlock, KeyBlock, SnippetBlock), Directives (Animate, Bind, Class, Let, On, Style, Transition, Use), Attribute, SpreadAttribute, Script, JSComment.