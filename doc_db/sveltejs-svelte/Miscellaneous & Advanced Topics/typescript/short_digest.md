## TypeScript in Svelte

Add `lang="ts"` to script tags for type-only features. For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`.

Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

## Typing Props, State, and Components

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select }: Props = $props();
	let count: number = $state(0);
</script>
```

Use `Component<Props>` and `ComponentProps<TComponent>` for component type constraints. Use `HTMLButtonAttributes` from `svelte/elements` for wrapper components.

## Extending Types

Enhance custom/experimental attributes in a `.d.ts` file:

```ts
declare namespace svelteHTML {
	interface IntrinsicElements {
		'my-custom-element': { someattribute: string };
	}
}
```

Or augment `svelte/elements` module directly.