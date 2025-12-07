## TypeScript in Svelte

Add `lang="ts"` to script tags. By default only type-only features work (annotations, interfaces, generics). For enums and non-standard features, configure preprocessor with `vitePreprocess({ script: true })` in `svelte.config.js`.

**tsconfig.json**: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`

**Props typing**:
```svelte
<script lang="ts">
	interface Props {
		required: number;
		optional?: boolean;
		snippet: Snippet<[string]>;
		handler: (arg: string) => void;
	}
	let { required, optional, snippet, handler }: Props = $props();
</script>
```

**Generic props**: Add `generics="Item extends { text: string }"` to script tag.

**Wrapper components**: Import `HTMLButtonAttributes` or `SvelteHTMLElements` from `svelte/elements`.

**State typing**: `let count: number = $state(0)`. Use `as` casting for undefined-until-initialized values.

**Component type**: Use `Component<Props>` for dynamic components, `ComponentProps<T>` to extract props type.

**Custom types**: Augment `svelte/elements` module in `.d.ts` file for experimental attributes/events.