## Reactive Built-ins

- **SvelteMap, SvelteSet, SvelteDate, SvelteURL, SvelteURLSearchParams**: Reactive versions of standard objects. Reading their contents in effects/derived triggers re-evaluation. Values are not deeply reactive.
- **MediaQuery** (5.7.0+): Reactive media query with `current` property. Prefer CSS media queries to avoid hydration issues.

## createSubscriber

Integrates external event systems with Svelte reactivity. Accepts a `start` callback that receives an `update` function to trigger effect re-runs. Returns a cleanup function when the effect is destroyed. Multiple effects share one `start` call.

```js
const subscribe = createSubscriber((update) => {
	const off = on(element, 'event', update);
	return () => off();
});
```