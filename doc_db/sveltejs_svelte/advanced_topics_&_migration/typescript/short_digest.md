## TypeScript in Svelte

Add `lang="ts"` to script tags for type-only features. For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`.

**tsconfig.json**: Set `target` to `ES2015`, `verbatimModuleSyntax` to `true`, `isolatedModules` to `true`.

**Typing $props**:
```svelte
<script lang="ts">
	interface Props { requiredProperty: number; }
	let { requiredProperty }: Props = $props();
</script>
```

**Generic $props**:
```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props { items: Item[]; select(item: Item): void; }
	let { items, select }: Props = $props();
</script>
```

**Wrapper components**: Use `HTMLButtonAttributes` or `SvelteHTMLElements` from `svelte/elements`.

**$state typing**: `let count: number = $state(0);` or use `as` casting for undefined initial values.

**Component type**: Use `Component` and `ComponentProps` to type dynamic components.

**Augment DOM types**: Extend `svelte/elements` module for custom attributes/events.