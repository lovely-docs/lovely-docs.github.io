## Tags
Lowercase tags like `<div>` are HTML elements. Capitalized tags or dot notation like `<Widget>` or `<my.stuff>` are components.

## Element attributes
Attributes work like HTML. Values can be unquoted, contain JavaScript expressions, or be pure expressions:
```svelte
<input type=checkbox />
<a href="page/{p}">page {p}</a>
<button disabled={!clickable}>...</button>
```

Boolean attributes are included if truthy, excluded if falsy. Other attributes are included unless nullish (`null` or `undefined`):
```svelte
<input required={false} placeholder="..." />
<div title={null}>no title attribute</div>
```

Shorthand: `{name}` replaces `name={name}`:
```svelte
<button {disabled}>...</button>
```

## Component props
Values passed to components are called props. Use the same `{name}` shorthand as with attributes.

## Spread attributes
Multiple attributes/props can be spread at once. Order matters — later values override earlier ones:
```svelte
<Widget a="b" {...things} c="d" />
```

## Events
Listen to DOM events with `on` prefix attributes. Event attributes are case-sensitive:
```svelte
<button onclick={() => console.log('clicked')}>click me</button>
```

Shorthand and spreading work: `<button {onclick}>` or `<button {...eventAttributes}>`.

Event attributes fire after bindings. `ontouchstart` and `ontouchmove` are passive for performance. For preventing defaults on these, use the `on` function from `svelte/events` instead.

Svelte delegates certain events (click, input, keydown, etc.) to the application root for performance. When manually dispatching delegated events, set `{ bubbles: true }`. Avoid `stopPropagation` with delegated events or use the `on` function from `svelte/events`.

## Text expressions
Include JavaScript expressions as text with curly braces:
```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>
```

Null/undefined are omitted; others are coerced to strings. Use HTML entities `&lbrace;` or `&#123;` for literal braces. Wrap RegExp literals in parentheses:
```svelte
<div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
```

Use `{@html}` to render HTML (ensure the string is escaped or controlled to prevent XSS):
```svelte
{@html potentiallyUnsafeHtmlString}
```

## Comments
HTML comments work normally. `svelte-ignore` comments disable warnings for the next block. Use `@component` comments to show documentation when hovering over component names in other files.