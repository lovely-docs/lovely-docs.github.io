Type actions using `Action<Element, Parameter, Attributes>` interface. Actions are functions called on element creation that can return `ActionReturn` with optional `update` and `destroy` methods. Example:

```ts
export const myAction: Action<HTMLDivElement, { prop: boolean } | undefined> = (node, param = { prop: true }) => {
	return {
		update: (p) => {...},
		destroy: () => {...}
	};
}
```