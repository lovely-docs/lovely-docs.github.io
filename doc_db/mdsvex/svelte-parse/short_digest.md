## Svelte Parser

Permissive Svelte syntax parser generating SVAST. Not a drop-in replacement for official parser.

**API:**
- `parse({ value, generatePositions? })` - Parse entire document, returns `{ ast: Root, errors }`
- `parseNode({ value, currentPosition?, childParser, block?, silent?, generatePositions })` - Parse single node, returns `{ chomped, unchomped, parsed, position }`

**Limitations:**
- JavaScript expressions: unbalanced braces in regexes cause failures
- HTML: no auto-closing of unclosed tags
- Each blocks: parsed as `BranchingBlock` with expression as blob

**Position tracking:**
```ts
interface Point {
  line: number;      // 1-indexed
  column: number;    // 1-indexed
  offset: number;    // 0-indexed
}
```