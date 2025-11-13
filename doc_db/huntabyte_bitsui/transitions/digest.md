## Using Transitions with Bits UI Components

Bits UI components don't support Svelte transition directives (`in:`, `out:`, `transition:`) directly. Instead, use the `forceMount` prop combined with the `child` snippet to apply transitions.

### Default Behavior
By default, components handle mounting/unmounting and wait for transitions to complete before removing from DOM. CSS transitions and animations work out of the box.

### Force Mounting Pattern
Set `forceMount={true}` on conditionally rendered components, then use the `child` snippet to conditionally render and apply transitions:

```svelte
<Dialog.Content forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fly>
        <!-- content -->
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
```

### Reusable Wrapper Component
For repeated use, create a wrapper component that encapsulates this pattern:

```svelte
<script lang="ts">
  import { Dialog, type WithoutChildrenOrChild } from "bits-ui";
  import { fly } from "svelte/transition";
  let { ref = $bindable(null), children, ...restProps }: WithoutChildrenOrChild<Dialog.ContentProps> & { children?: Snippet } = $props();
</script>
<Dialog.Content bind:ref {...restProps} forceMount={true}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fly>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Dialog.Content>
```

### Floating UI Components
For components using Floating UI (like `Popover.Content`), add a wrapper element and spread `wrapperProps`:

```svelte
<Popover.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- content -->
        </div>
      </div>
    {/if}
  {/snippet}
</Popover.Content>
```