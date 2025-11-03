Runes are a core feature of Svelte that enable reactive state management and side effects in components. They provide a way to declare reactive variables, derived values, and effects using special functions prefixed with `$`.

Key runes include:
- `$state`: Creates reactive state variables that automatically trigger updates when modified
- `$derived`: Computes derived values that update whenever their dependencies change
- `$effect`: Runs side effects when dependencies change, useful for synchronizing with external systems
- `$watch`: Observes changes to specific values and runs callbacks

Runes replace the previous reactivity model and are the recommended approach for managing component state and reactivity in modern Svelte applications.