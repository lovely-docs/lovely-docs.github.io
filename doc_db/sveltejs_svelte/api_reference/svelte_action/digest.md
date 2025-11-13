## Action

Actions are functions called when an element is created. Type them using the `Action` interface:

```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {
	// ...
}
```

- First generic parameter: element type (e.g., `HTMLDivElement`)
- Second generic parameter: parameter type (omit or use `undefined` for no parameters)
- Third generic parameter: additional attributes/events the action enables

Actions can return an `ActionReturn` object with optional `update` and `destroy` methods:

```ts
interface Attributes {
	newprop?: string;
	'on:event': (e: CustomEvent<boolean>) => void;
}

export function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes> {
	return {
		update: (updatedParameter) => {...},
		destroy: () => {...}
	};
}
```

- `update`: called when the action's parameter changes
- `destroy`: called after the element is unmounted
- Attributes/events in the return type are TypeScript-only, no runtime effect

Note: Actions have been superseded by attachments.