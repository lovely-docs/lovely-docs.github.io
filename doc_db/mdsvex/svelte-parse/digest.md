## Overview

A Svelte syntax parser that generates SVAST (Svelte Abstract Syntax Tree). It performs no validation and allows permissive parsing of Svelte syntax.

## Key Characteristics

- **Not a drop-in replacement** for the official Svelte parser
- **Permissive parsing**: allows invalid syntax that looks valid
- **Language agnostic**: doesn't parse content inside expressions and script elements
- **Error tolerant**: continues parsing and reports errors separately rather than throwing
- **No validation** for directives, modifiers, special tags, script/style elements

## Limitations

- **JavaScript expressions**: Matches curly braces and ignores quoted values. Fails if regular expressions contain unbalanced braces
- **HTML parsing**: Rudimentary implementation. Handles void tags (`<input/>` and `<input>` treated the same) but doesn't auto-close unclosed tags like `<p>`
- **Each blocks**: Currently parsed as `BranchingBlock` instead of `EachBlock` because language-agnostic parsing is difficult. Expression, name, index, and key stored as a blob in the expression field

## Installation

```bash
npm i svelte-parse
```

## API

### `parse(options)`

Parses entire Svelte document and returns AST.

```ts
interface ParseOptions {
  value: string;
  generatePositions?: boolean; // default = false
}
```

Returns:
```ts
interface ParseResult {
  ast: Root;
  errors: unknown[]; // WIP/TODO
}

interface Root {
  type: 'root';
  children: (SvelteElement | SvelteComponent | Comment | Text | SvelteExpression | VoidBlock | BranchingBlock | IfBlock | EachBlock | AwaitBlock | SvelteTag)[];
}
```

Example:
```js
import { parse } from 'svelte-parse';

const { ast, errors } = parse({ 
  value: `{@html someHTML}\n<div><input on:input={(e) => console.log(e)}/></div>`,
  generatePositions: true 
});
```

### `parseNode(options)`

Parses a single node from source string. Designed for composing parsers in hybrid languages. Returns the parsed node, positional info, and remaining unparsed content.

```ts
interface ParseNodeOptions {
  value: string;
  currentPosition?: Point & { index?: number };
  childParser: (options: ParseNodeOptions) => [Node[], Point & { index?: number }, number];
  block?: boolean;
  silent?: boolean;
  generatePositions: boolean;
}

interface Result {
  chomped: string;        // parsed portion
  unchomped: string;      // remaining portion
  parsed: Node;           // AST node
  position?: Point & { index?: number };
}
```

The `childParser` function should parse children and return `[nodes, position, index]`. It receives the same options as `parseNode` and should know when to yield to its caller.

### `Point`

Position tracking object:
```ts
interface Point {
  line: number;      // 1-indexed
  column: number;    // 1-indexed
  offset: number;    // 0-indexed character offset
}
```

## Usage Pattern

For document-level parsing, use `parse()`. For composable parsing (e.g., in hybrid language parsers), use `parseNode()` in a loop, passing `unchomped` back as `value` and `position` back as `currentPosition` in subsequent calls. See the library's `parse()` and `parse_siblings()` implementations for reference.