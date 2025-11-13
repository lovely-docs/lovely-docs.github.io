## Core API Reference

### Component Lifecycle & Mounting
- `mount(component, options)` - Mount a component to a target element, returns exports. Plays transitions by default unless `intro: false`.
- `hydrate(component, options)` - Hydrate a component on a target, returns exports and props.
- `unmount(component, options)` - Unmount a component. If `options.outro: true`, plays exit transitions before removal.

### Lifecycle Hooks
- `onMount(fn)` - Runs once after component mounts to DOM. Synchronously returned function runs on unmount. Does not run during SSR.
- `onDestroy(fn)` - Runs before component unmounts. Only lifecycle hook that runs during SSR.
- `beforeUpdate(fn)` - Deprecated, use `$effect.pre` instead. Runs before component updates.
- `afterUpdate(fn)` - Deprecated, use `$effect` instead. Runs after component updates.

### State & Effects
- `tick()` - Returns promise that resolves once pending state changes are applied.
- `settled()` - Returns promise that resolves once state changes and async work complete and DOM updates.
- `flushSync(fn?)` - Synchronously flush pending updates. Returns void or callback result.
- `untrack(fn)` - Prevents state reads inside `fn` from becoming dependencies in `$derived` or `$effect`.
- `getAbortSignal()` - Returns AbortSignal that aborts when current derived/effect re-runs or is destroyed. Useful for fetch requests.

### Context
- `setContext(key, context)` - Associate context with current component, available to children via `getContext`.
- `getContext(key)` - Retrieve context from closest parent component. Must be called during initialization.
- `getAllContexts()` - Get entire context map from closest parent.
- `hasContext(key)` - Check if key exists in parent context.
- `createContext()` - Type-safe alternative returning `[get, set]` pair. `get` throws if parent didn't call `set`.

### Events
- `createEventDispatcher()` - Deprecated, use callback props or `$host()` instead. Creates dispatcher for component events.

### Snippets
- `createRawSnippet(fn)` - Create snippet programmatically. Function receives getters for params and returns `{ render: () => string, setup?: (element) => void | cleanup }`.

### Advanced
- `fork(fn)` - Create fork where state changes are evaluated but not applied to DOM. Useful for speculative data loading. Returns Fork with `commit()` and `discard()` methods.

### Legacy (Svelte 4)
- `SvelteComponent` - Base class for Svelte 4 components. Deprecated, use `Component` type and `mount()` instead.
- `SvelteComponentTyped` - Deprecated, use `Component` instead.

### Types
- `Component<Props, Exports, Bindings>` - Type for strongly-typed Svelte components.
- `ComponentProps<Comp>` - Extract props type from component.
- `Snippet<Parameters>` - Type for snippet blocks.
- `MountOptions<Props>` - Options for `mount()` function.
- `Fork` - Interface with `commit()` and `discard()` methods.