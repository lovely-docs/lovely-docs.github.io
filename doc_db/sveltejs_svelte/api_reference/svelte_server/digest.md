## render

Server-side only function for rendering Svelte components to HTML. Available when compiling with the `server` option.

**Function signature:**
```js
render(component, options?)
```

**Parameters:**
- `component`: A Svelte component
- `options` (optional):
  - `props`: Component props (required if component has required props)
  - `context`: Map of context values
  - `idPrefix`: String prefix for generated IDs

**Returns:** Object with `body` and `head` properties containing the rendered HTML.

**Example:**
```js
import { render } from 'svelte/server';
import MyComponent from './MyComponent.svelte';

const { body, head } = render(MyComponent, {
  props: { title: 'Hello' },
  context: new Map([['theme', 'dark']])
});
```