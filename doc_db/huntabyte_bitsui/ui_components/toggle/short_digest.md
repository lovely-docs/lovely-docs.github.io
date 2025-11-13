## Toggle Component

A button that switches between pressed/unpressed states.

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let pressed = $state(false);
</script>
<Toggle.Root bind:pressed={pressed} />
```

**State management:** Use `bind:pressed` for two-way binding, or function bindings `bind:pressed={getPressed, setPressed}` for full control.

**Key props:** `pressed`, `onPressedChange`, `disabled`, `ref`

**Data attributes:** `data-state` ('on'|'off'), `data-disabled`, `data-toggle-root`