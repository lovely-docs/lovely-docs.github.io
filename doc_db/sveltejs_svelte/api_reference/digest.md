## Core Runtime API

**Component Lifecycle & Mounting**
- `mount(component, options)` - Mount component to target, returns exports. Plays transitions by default unless `intro: false`
- `hydrate(component, options)` - Hydrate component on target
- `unmount(component, options)` - Unmount component with optional outro transitions

**Lifecycle Hooks**
- `onMount(fn)` - Runs after component mounts to DOM. Returned function runs on unmount. Doesn't run during SSR
- `onDestroy(fn)` - Runs before unmount. Only hook that runs during SSR
- `beforeUpdate(fn)` - Deprecated, use `$effect.pre` instead
- `afterUpdate(fn)` - Deprecated, use `$effect` instead

**State & Effects**
- `tick()` - Returns promise resolving once pending state changes apply
- `settled()` - Returns promise resolving once state changes, async work, and DOM updates complete
- `flushSync(fn?)` - Synchronously flush pending updates
- `untrack(fn)` - Prevents state reads inside `fn` from becoming dependencies in `$derived` or `$effect`
- `getAbortSignal()` - Returns AbortSignal that aborts when derived/effect re-runs or destroys

**Context**
- `setContext(key, context)` - Associate context with current component
- `getContext(key)` - Retrieve context from closest parent. Must be called during initialization
- `getAllContexts()` - Get entire context map from closest parent
- `hasContext(key)` - Check if key exists in parent context
- `createContext()` - Type-safe alternative returning `[get, set]` pair

**Events**
- `createEventDispatcher()` - Deprecated, use callback props or `$host()` instead

**Snippets**
- `createRawSnippet(fn)` - Create snippet programmatically. Function receives getters for params and returns `{ render: () => string, setup?: (element) => void | cleanup }`

**Advanced**
- `fork(fn)` - Create fork where state changes evaluate but don't apply to DOM. Returns Fork with `commit()` and `discard()` methods

**Types**
- `Component<Props, Exports, Bindings>` - Type for strongly-typed Svelte components
- `ComponentProps<Comp>` - Extract props type from component
- `Snippet<Parameters>` - Type for snippet blocks
- `MountOptions<Props>` - Options for `mount()` function

## Actions

Type actions using `Action` interface:
```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {
	// ...
}
```

Actions can return `ActionReturn` with optional `update` and `destroy` methods. Third generic parameter defines additional attributes/events the action enables.

## Animations

**flip** - Animates element between start and end positions using FLIP (First, Last, Invert, Play):
```js
import { flip } from 'svelte/animate';
function flip(node: Element, { from, to }: { from: DOMRect; to: DOMRect }, params?: FlipParams): AnimationConfig;
```

AnimationConfig: `delay`, `duration`, `easing`, `css(t, u)`, `tick(t, u)`

## Attachments

**createAttachmentKey** - Creates symbol key for programmatic attachment creation. When spread onto element, recognized as attachment:
```js
const props = {
  [createAttachmentKey()]: (node) => { node.textContent = 'attached!'; }
};
```

**fromAction** - Converts action into attachment with identical behavior:
```js
<div {@attach fromAction(foo, () => bar)}>...</div>
```

Attachment is function that runs when element mounts to DOM and optionally returns cleanup function called on unmount.

## Compiler API

**compile(source, options)** - Converts `.svelte` source to JavaScript module. Returns `CompileResult` with `js`, `css`, `warnings`, `metadata`, `ast`

**compileModule(source, options)** - Compiles JavaScript source containing runes into module. Always operates in runes mode

**parse(source, options)** - Parses component and returns AST. Supports both modern and legacy formats via `modern` option

**preprocess(source, preprocessor, options)** - Applies preprocessor hooks to transform source. Accepts single or array of `PreprocessorGroup`. Returns `Promise<Processed>`

**migrate(source, options)** - Performs best-effort migration to runes, event attributes, and render tags

**VERSION** - Current version string

Key compile options: `name`, `customElement`, `generate` ('client'|'server'|false), `dev`, `css` ('injected'|'external'), `runes`, `namespace`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `hmr`, `modernAst`

## Easing Functions

`svelte/easing` provides: `linear`, `quadIn/Out/InOut`, `cubicIn/Out/InOut`, `quartIn/Out/InOut`, `quintIn/Out/InOut`, `sineIn/Out/InOut`, `expoIn/Out/InOut`, `circIn/Out/InOut`, `backIn/Out/InOut`, `bounceIn/Out/InOut`, `elasticIn/Out/InOut`

Each accepts normalized time `t` (0 to 1) and returns eased value.

## Event Handling

**on(element, type, handler, options?)** - Attaches event handler to DOM elements and returns removal function. Preserves correct handler execution order relative to declarative handlers:
```js
import { on } from 'svelte/events';
const unsubscribe = on(window, 'resize', (event) => { console.log('resized'); });
```

## Legacy Utilities

`svelte/legacy` provides deprecated migration functions:
- Component: `asClassComponent(component)`, `createClassComponent(options)`
- Events: `handlers()`, `once(fn)`, `preventDefault(fn)`, `stopPropagation(fn)`, `stopImmediatePropagation(fn)`, `self(fn)`, `trusted(fn)`
- Actions: `passive(node, [event, handler])`, `nonpassive(node, [event, handler])`
- Other: `createBubbler()`, `run(fn)`

## Motion

**Spring** - Animates values with spring physics. Changes to `spring.target` smoothly move `spring.current`:
```js
const spring = new Spring(0);
spring.target = 100;
spring.set(value, options); // options: instant, preserveMomentum
```

**Tween** - Animates values over fixed duration. Changes to `tween.target` move `tween.current`:
```js
const tween = new Tween(0);
tween.target = 100;
tween.set(value, options);
```

**prefersReducedMotion** - Media query detecting user preference for reduced motion. Use to conditionally disable animations

## Reactive Window Values

`svelte/reactivity/window` exports reactive wrappers with `.current` property:
- `innerWidth.current`, `innerHeight.current` - viewport dimensions
- `outerWidth.current`, `outerHeight.current` - window dimensions
- `scrollX.current`, `scrollY.current` - scroll position
- `screenLeft.current`, `screenTop.current` - window position
- `devicePixelRatio.current` - pixel ratio
- `online.current` - network status

All undefined on server.

## Reactive Built-ins

`svelte/reactivity` provides reactive versions of standard objects:
- **SvelteMap** - Reactive Map. Reading via iteration, `size`, `get()`, `has()` triggers reactivity
- **SvelteSet** - Reactive Set. Reading via iteration, `size`, `has()` triggers reactivity
- **SvelteDate** - Reactive Date. Reading via methods like `getTime()`, `toString()` triggers reactivity
- **SvelteURL** - Reactive URL. Reading properties like `href`, `pathname`, `protocol`, `hostname` triggers reactivity
- **SvelteURLSearchParams** - Reactive URLSearchParams. Reading via iteration, `get()`, `getAll()` triggers reactivity
- **MediaQuery** - Creates media query with `current` property reflecting match status

**createSubscriber** - Returns `subscribe` function integrating external event systems with Svelte reactivity. When called inside effect, `start` callback receives `update` function that re-runs effect when called. If `start` returns cleanup function, it's called when effect destroys.

## Server-Side Rendering

**render(component, options?)** - Server-only function rendering Svelte components to HTML. Available when compiling with `server` option:
```js
const { body, head } = render(MyComponent, {
  props: { title: 'Hello' },
  context: new Map([['theme', 'dark']])
});
```

## Stores

**writable** - Create store with read and write capabilities:
```js
const count = writable(0);
count.subscribe(value => console.log(value));
count.set(1);
count.update(n => n + 1);
```

**readable** - Create read-only store with optional start/stop callbacks:
```js
const time = readable(new Date(), set => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});
```

**derived** - Create store computed from source stores:
```js
const doubled = derived(count, $count => $count * 2);
const sum = derived([a, b], ([$a, $b], set) => { set($a + $b); });
```

**get** - Retrieve current store value synchronously: `const value = get(myStore);`

**readonly** - Wrap store to expose only read interface

**fromStore** - Convert store to reactive object with `.current` property

**toStore** - Convert getter/setter functions into store

## Transitions

Built-in transition functions:
- **blur** - Animates blur filter and opacity. Params: `delay`, `duration`, `easing`, `amount`, `opacity`
- **fade** - Animates opacity. Params: `delay`, `duration`, `easing`
- **fly** - Animates x, y position and opacity. Params: `delay`, `duration`, `easing`, `x`, `y`, `opacity`
- **scale** - Animates opacity and scale. Params: `delay`, `duration`, `easing`, `start`, `opacity`
- **slide** - Slides element in/out along axis. Params: `delay`, `duration`, `easing`, `axis` ('x'|'y')
- **draw** - Animates SVG stroke like drawing. Works with `<path>`, `<polyline>`. Params: `delay`, `speed`, `duration`, `easing`
- **crossfade** - Creates paired `send` and `receive` transitions morphing elements between positions. Accepts `fallback` transition. Params: `delay`, `duration`, `easing`

All return `TransitionConfig` with optional `delay`, `duration`, `easing`, `css(t, u)`, `tick(t, u)`.

## Error & Warning Reference

Comprehensive reference for all Svelte compiler and runtime errors and warnings organized by category:

**Client-Side Errors**: Reactivity & state, effects, binding, components & lifecycle, other
**Client-Side Warnings**: Assignment, await, console, hydration, transitions
**Compiler Errors**: Animation, attributes, binding, blocks, const tag, declarations, CSS, derived/export, each block, effect, event handler, props, rune, snippet, state, Svelte meta elements, Svelte options, textarea, transition, parsing
**Compiler Warnings**: Accessibility (a11y_*), code quality, deprecated options, other
**Server-Side Errors**: Async work, deprecated HTML property, lifecycle unavailable
**Shared Errors**: Invalid snippets, lifecycle outside component, missing context, store shape
**Shared Warnings**: Void element content, uncloneable snapshots