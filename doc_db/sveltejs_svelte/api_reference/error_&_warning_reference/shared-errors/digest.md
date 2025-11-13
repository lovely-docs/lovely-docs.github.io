## Error Reference

**invalid_default_snippet**
Cannot use `{@render children(...)}` if parent uses `let:` directives. Use named snippets instead.

**invalid_snippet_arguments**
Snippets must be instantiated via `{@render ...}`, not called directly.

**lifecycle_outside_component**
Lifecycle methods like `onMount()` can only be called at the top level of component instance scripts, not inside event handlers or other functions.

```svelte
<script>
  import { onMount } from 'svelte';
  
  // Correct
  onMount(() => {})
  
  // Wrong - inside function
  function handleClick() {
    onMount(() => {})
  }
</script>
```

**missing_context**
The `get` function from `createContext()` throws if `set` was never called in a parent component.

**snippet_without_render_tag**
Snippets must be rendered with `{@render snippet()}`, not `{snippet}`. Applies to both child components receiving snippets and parent components passing them.

```svelte
<!-- Wrong -->
<script>
  let { children } = $props();
</script>
{children}

<!-- Correct -->
{@render children()}
```

**store_invalid_shape**
A store must have a `subscribe` method.

**svelte_element_invalid_this_value**
The `this` prop on `<svelte:element>` must be a string if defined.