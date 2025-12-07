## ScrollState

Reactive scroll tracking utility with position, direction, edge detection, and programmatic scrolling.

```svelte
const scroll = new ScrollState({ element: () => el });
// Access: scroll.x, scroll.y, scroll.directions, scroll.arrived, scroll.progress
// Methods: scroll.scrollTo(x, y), scroll.scrollToTop(), scroll.scrollToBottom()
```

Options: `element` (required), `idle` (200ms), `offset` (0), `onScroll`, `onStop`, `eventListenerOptions`, `behavior` ("auto"), `onError`

Respects RTL and reverse flex layouts. Position and arrival state are reactive and settable.