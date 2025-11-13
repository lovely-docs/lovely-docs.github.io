## render

Server-side function to render Svelte components to HTML strings.

```js
import { render } from 'svelte/server';
const { body, head } = render(Component, { props: {...}, context: new Map() });
```

Returns object with `body` and `head` properties. Options include `props`, `context`, and `idPrefix`.