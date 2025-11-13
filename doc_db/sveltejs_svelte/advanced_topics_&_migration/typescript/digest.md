## Using TypeScript in Svelte

Add `lang="ts"` to script tags to enable TypeScript. This supports type-only features (type annotations, interfaces) that disappear during transpilation. Features requiring compiler output like enums, constructor modifiers with initializers, and non-standard ECMAScript features are not supported without a preprocessor.

## Preprocessor Setup

For full TypeScript support, configure a preprocessor in `svelte.config.js`:

```ts
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: vitePreprocess({ script: true }) };
export default config;
```

SvelteKit and Vite projects include this automatically. For Rollup/Webpack, install `typescript` and `svelte-preprocess`, then configure the respective plugins.

## tsconfig.json Requirements

- Set `target` to at least `ES2015`
- Set `verbatimModuleSyntax` to `true`
- Set `isolatedModules` to `true`

## Typing $props

Define props as an interface and destructure with `$props()`:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
	}
	let { requiredProperty, optionalProperty, snippetWithStringArgument, eventHandler }: Props = $props();
</script>
```

## Generic $props

Use the `generics` attribute on script tags to declare generic relationships:

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select }: Props = $props();
</script>
```

## Typing Wrapper Components

Use `HTMLButtonAttributes` or `SvelteHTMLElements` from `svelte/elements` to expose native element attributes:

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>
<button {...rest}>{@render children?.()}</button>
```

## Typing $state

Type `$state` like regular variables. Without an initial value, the type includes `undefined`. Use `as` casting when the value will be defined before use:

```ts
let count: number = $state(0);
class Counter {
	count = $state() as number;
	constructor(initial: number) { this.count = initial; }
}
```

## Component Type

Use `Component` type to constrain dynamic components and `ComponentProps` to extract component properties:

```ts
import type { Component, ComponentProps } from 'svelte';
function withProps<TComponent extends Component<any>>(component: TComponent, props: ComponentProps<TComponent>) {}
```

Access component constructor/instance types with `typeof MyComponent` and `MyComponent` respectively.

## Augmenting DOM Types

Enhance `svelte/elements` module to add custom or experimental attributes/events:

```ts
declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}
	export interface HTMLAttributes<T> {
		globalattribute?: string;
	}
}
```

Reference the `.d.ts` file in `tsconfig.json`.