## IsInViewport

Tracks if an element is visible in the viewport using Intersection Observer.

```ts
const inViewport = new IsInViewport(() => targetNode);
// inViewport.current returns boolean
```

Accepts element or getter function, optional config options matching `useIntersectionObserver`.