## IsUsingKeyboard

A utility component that tracks whether the user is actively using the keyboard. Used internally by Bits UI components to provide keyboard accessibility features.

Provides global state shared across all instances to prevent duplicate event listener registration.

### Usage

```svelte
<script lang="ts">
  import { IsUsingKeyboard } from "bits-ui";
  const isUsingKeyboard = new IsUsingKeyboard();
  const shouldShowMenu = $derived(isUsingKeyboard.current);
</script>
```