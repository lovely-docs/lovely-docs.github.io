## Core API

**Component** - Type-safe component type (replaces deprecated SvelteComponent).

**mount/hydrate/unmount** - Mount components to DOM, hydrate SSR, unmount with optional transitions.

**Lifecycle**: onMount, onDestroy, beforeUpdate (deprecated), afterUpdate (deprecated).

**Context**: createContext, getContext, setContext, getAllContexts, hasContext.

**Events**: createEventDispatcher (deprecated, use callback props).

**State**: tick, settled, flushSync, fork (speculative updates).

**Utilities**: untrack (exclude from dependencies), getAbortSignal (abort on re-run), createRawSnippet.

**Types**: ComponentProps, MountOptions, Snippet, EventDispatcher, Fork.