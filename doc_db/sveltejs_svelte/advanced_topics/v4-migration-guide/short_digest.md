## Key changes for Svelte 4

**Version requirements:** Node 16+, TypeScript 5+, SvelteKit 1.20.4+, webpack 5+

**Bundler config:** Must specify `browser` condition (Rollup: `browser: true` in node-resolve; webpack: add `"browser"` to `conditionNames`)

**Removed:** CommonJS output, `svelte/register`, CJS runtime

**Stricter types:**
```ts
// createEventDispatcher enforces payload requirements
const dispatch = createEventDispatcher<{
	optional: number | null;
	required: string;
	noArgument: null;
}>();
dispatch('required'); // error: missing argument

// Action/ActionReturn need explicit generic for parameters
const action: Action<HTMLElement, string> = (node, params) => { ... }

// onMount errors on async function returns
onMount(() => {
	foo().then(x => {...});
	return () => cleanup();
});
```

**API changes:**
- `<svelte:options tag="x" />` → `<svelte:options customElement="x" />`
- `SvelteComponentTyped` → `SvelteComponent`
- Transitions local by default (use `|global` for old behavior)
- Default slot bindings not exposed to named slots
- Preprocessor order: now sequential per-preprocessor (markup → script → style)
- `eslint-plugin-svelte3` → `eslint-plugin-svelte`
- `svelte.JSX` → `svelteHTML` namespace and `svelte/elements` types