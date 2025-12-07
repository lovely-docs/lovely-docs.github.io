The `style:` directive sets CSS styles on elements with shorthand syntax. Supports dynamic values, multiple styles, and `|important` modifier. Directives take precedence over `style` attributes even with `!important`.

**Examples:**
```svelte
<div style:color="red">...</div>
<div style:color={myColor}>...</div>
<div style:color style:width="12rem" style:background-color={darkMode ? 'black' : 'white'}>...</div>
<div style:color|important="red">...</div>
```