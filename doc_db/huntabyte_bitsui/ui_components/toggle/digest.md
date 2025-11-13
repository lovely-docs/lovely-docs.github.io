## Toggle Component

A button control that switches between two states (pressed/unpressed).

### Basic Usage

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let pressed = $state(false);
</script>
<Toggle.Root bind:pressed={pressed} />
```

### State Management

**Two-way binding** - automatic synchronization:
```svelte
<Toggle.Root bind:pressed={myPressed} />
```

**Fully controlled** - using function bindings for complete control:
```svelte
<script lang="ts">
  let myPressed = $state(false);
  function getPressed() { return myPressed; }
  function setPressed(newPressed: boolean) { myPressed = newPressed; }
</script>
<Toggle.Root bind:pressed={getPressed, setPressed} />
```

### API Reference

**Toggle.Root** properties:
- `pressed` (bindable, boolean, default: false) - Whether the toggle is pressed
- `onPressedChange` (function) - Callback when pressed state changes
- `disabled` (boolean, default: false) - Disables the toggle
- `ref` (bindable, HTMLButtonElement) - Reference to underlying DOM element
- `children` (Snippet) - Content to render
- `child` (Snippet) - For render delegation

**Data attributes:**
- `data-state` - 'on' or 'off'
- `data-disabled` - Present when disabled
- `data-toggle-root` - Present on root element