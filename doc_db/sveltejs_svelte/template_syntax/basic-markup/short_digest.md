## Tags
Lowercase tags are HTML elements, capitalized/dot-notation tags are components.

## Attributes & Props
Attributes work like HTML with JavaScript expressions. Use `{name}` shorthand for `name={name}`. Spread with `{...obj}`. Boolean attributes include if truthy, exclude if falsy; others include unless nullish.

## Events
Listen with `on` prefix (case-sensitive). Certain events are delegated to root for performance; use `on` from `svelte/events` instead of `addEventListener` to handle delegation correctly.

## Text & HTML
Expressions in `{...}` render as text (null/undefined omitted). Use `{@html}` for HTML (with XSS caution). Use HTML entities `&lbrace;`/`&#123;` for literal braces.

## Comments
HTML comments work. `svelte-ignore` disables warnings. `@component` comments show on hover with markdown support.