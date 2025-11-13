Runes are compiler-controlled symbols prefixed with `$` that form part of Svelte's syntax, functioning as keywords. They control the Svelte compiler and are used in `.svelte` and `.svelte.js`/`.svelte.ts` files.

Key characteristics:
- Prefixed with `$` and appear as function calls: `let message = $state('hello');`
- Not imported — built into the language
- Not assignable values — cannot be assigned to variables or passed as function arguments
- Valid only in specific positions — the compiler validates placement

Runes are a Svelte 5+ feature.