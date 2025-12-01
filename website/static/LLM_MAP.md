# sveltejs/svelte

Complete reference for Svelte 5 framework covering runes-based reactivity, template syntax, styling, component lifecycle, state management, animations, and migration from legacy mode.

./introduction.md: Svelte is a compiler framework for building UIs with components that combine HTML, CSS, and JavaScript, with setup via SvelteKit or Vite.
./introduction/getting_started.md: Instructions for setting up a new Svelte project using SvelteKit or Vite, with editor tooling and support resources.
./introduction/svelte_files.md: Svelte components are written in .svelte files with optional script, style, and markup sections; script blocks run per-instance while script module blocks run once at module load.
./runes.md: Compiler-controlled `$`-prefixed keywords that manage reactive state, derived values, side effects, component inputs, and debugging in Svelte.
./runes/what_are_runes.md: Runes are explicit opt-in reactivity primitives (like `$state`, `$derived`) used in `.svelte.js` and Svelte 5 components.
./runes/$state.md: `$state`declares reactive state variables that automatically trigger UI updates when reassigned or mutated (for arrays/objects).
    ./runes/$derived.md:`$derived` creates read-only reactive values that automatically update when their dependencies change.
    ./runes/$effect.md: `$effect` runs side-effects (like DOM manipulation) after the component mounts or when dependencies change; it replaces `onMount` and `afterUpdate`.
