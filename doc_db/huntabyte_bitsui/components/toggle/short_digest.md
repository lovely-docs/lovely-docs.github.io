## Toggle Component

Two-state button control with bindable `pressed` state.

**Basic usage:**
```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let pressed = $state(false);
</script>
<Toggle.Root bind:pressed={pressed} />
```

**API:** `pressed` (bindable boolean), `onPressedChange` callback, `disabled` boolean, `ref` (bindable HTMLButtonElement), `children`/`child` snippets. Data attributes: `data-state` ('on'|'off'), `data-disabled`, `data-toggle-root`.