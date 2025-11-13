## Animate Directive

Triggers animations when keyed each block contents are reordered (not on add/remove). Use built-in functions or custom ones.

**Parameters:**
```svelte
<li animate:flip={{ delay: 500 }}>{item}</li>
```

**Custom function signature:**
```js
function animate(node, { from: DOMRect, to: DOMRect }, params) {
	return {
		delay?: number,
		duration?: number,
		easing?: (t: number) => number,
		css?: (t: number, u: number) => string,  // preferred
		tick?: (t: number, u: number) => void
	};
}
```

`t` ranges 0-1 after easing, `u` = 1 - t. Use `css` for web animations (off main thread), `tick` for imperative updates.