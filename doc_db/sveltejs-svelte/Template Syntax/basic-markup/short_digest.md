## Tags
Lowercase tags are HTML elements, capitalized/dot-notation tags are components.

## Attributes & Props
Attributes support JavaScript expressions and shorthand: `<button disabled={!clickable}>` or `<button {disabled}>`. Boolean attributes are included if truthy. Spread multiple at once: `<Widget a="b" {...things} c="d" />`.

## Events
Listen with `on` prefix: `<button onclick={handler}>`. Event attributes are case-sensitive and delegated to root for performance. Use `svelte/events` `on` function to avoid `stopPropagation` issues.

## Text expressions
Include expressions with braces: `<h1>Hello {name}!</h1>`. Null/undefined omitted, others stringified. Use `{@html}` for HTML (with XSS precautions).

## Comments
HTML comments work. `svelte-ignore` disables warnings. `@component` shows documentation on hover.