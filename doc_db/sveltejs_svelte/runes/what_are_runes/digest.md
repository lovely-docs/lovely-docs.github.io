Runes are compiler-controlled symbols in Svelte that use a `$` prefix and look like functions. They are keywords in the Svelte language, not regular JavaScript functions.

Key differences from normal functions:
- No import needed — built into the language
- Not assignable values — can't be assigned to variables or passed as arguments
- Only valid in specific positions — compiler validates placement

Example:
```js
let message = $state('hello');
```

Runes were introduced in Svelte 5.