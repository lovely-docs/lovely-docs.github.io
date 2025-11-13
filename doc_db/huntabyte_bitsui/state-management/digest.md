## Two-Way Binding

Use Svelte's `bind:` directive for simple state management:

```svelte
<script lang="ts">
  import { ComponentName } from "bits-ui";
  let myValue = $state("default-value");
</script>
<button onclick={() => (myValue = "new-value")}> Update Value </button>
<ComponentName.Root bind:value={myValue}></ComponentName.Root>
```

Benefits: zero-boilerplate state updates, external controls work automatically, ideal for simple use cases.

## Function Binding

For advanced control, use Function Binding with custom getter and setter logic:

```svelte
<script lang="ts">
  import { ComponentName } from "bits-ui";
  let myValue = $state("default-value");
  function getValue() {
    return myValue;
  }
  function setValue(newValue: string) {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 9 && hour <= 17) {
      myValue = newValue;
    }
  }
</script>
<ComponentName.Root bind:value={getValue, setValue}></ComponentName.Root>
```

Use when you need: complex state transformation logic, conditional updates, debouncing/throttling, maintaining additional state alongside the primary value, or integrating with external state systems.

Note: Any `bindable` prop can be used instead of `value`.