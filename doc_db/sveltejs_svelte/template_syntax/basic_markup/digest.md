## Tags
Lowercase tags like `<div>` are HTML elements. Capitalized tags or dot notation like `<Widget>` or `<my.stuff>` are components.

## Element attributes
Attributes work like HTML. Values can be unquoted, contain JavaScript expressions, or be pure expressions:
```svelte
<input type=checkbox />
<a href="page/{p}">page {p}</a>
<button disabled={!clickable}>...</button>
```

Boolean attributes are included if truthy, excluded if falsy. Other attributes are included unless nullish (null or undefined):
```svelte
<input required={false} placeholder="..." />
<div title={null}>no title attribute</div>
```

Shorthand: `{name}` replaces `name={name}`:
```svelte
<button {disabled}>...</button>
```

## Component props
Pass values to components as props. Shorthand `{name}` works here too:
```svelte
<Widget foo={bar} answer={42} text="hello" />
```

## Spread attributes
Multiple attributes/props can be spread at once. Order matters — later values override earlier ones:
```svelte
<Widget a="b" {...things} c="d" />
```

## Events
Listen to DOM events with `on` prefix attributes. Case-sensitive: `onclick` listens to `click`, `onClick` listens to `Click`:
```svelte
<button onclick={() => console.log('clicked')}>click me</button>
```

Event attributes follow attribute rules (shorthand, spreading work). Event attributes fire after bindings.

`ontouchstart` and `ontouchmove` handlers are passive for performance. Use the `on` function from `svelte/events` instead if you need to prevent defaults.

Svelte delegates certain events (click, input, keydown, etc.) to the application root for performance. When dispatching delegated events manually, set `{ bubbles: true }`. Avoid `stopPropagation` with delegated listeners or handlers won't be invoked.

## Text expressions
Include JavaScript expressions as text with curly braces:
```svelte
<h1>Hello {name}!</h1>
<p>{a} + {b} = {a + b}.</p>
<div>{(/^[A-Za-z ]+$/).test(value) ? x : y}</div>
```

Null/undefined expressions are omitted; others are coerced to strings. Use HTML entities `&lbrace;` or `&#123;` for literal braces. Wrap RegExp literals in parentheses.

Use `{@html string}` to render HTML (ensure the string is safe to prevent XSS).

## Comments
HTML comments work normally. `<!-- svelte-ignore a11y_autofocus -->` disables warnings for the next block. `<!-- @component ... -->` comments show when hovering over the component name in other files and support markdown.