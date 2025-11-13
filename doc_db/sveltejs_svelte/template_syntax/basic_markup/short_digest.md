## Tags
Lowercase tags are HTML elements, capitalized/dot-notation tags are components.

## Attributes & Props
Attributes support expressions: `<button disabled={!clickable}>`, shorthand `{name}`, and spreading `{...things}`. Boolean attributes are included if truthy. Props work the same way.

## Events
Listen with `on` prefix: `<button onclick={handler}>`. Case-sensitive. Certain events are delegated to root for performance; dispatch with `{ bubbles: true }` and avoid `stopPropagation`.

## Text expressions
```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>
```
Null/undefined omitted, others coerced to strings. Use `{@html string}` for HTML.

## Comments
`<!-- svelte-ignore a11y_autofocus -->` disables warnings. `<!-- @component ... -->` shows on hover.