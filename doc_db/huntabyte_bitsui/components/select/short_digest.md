## Select Component

Dropdown for selecting from options with typeahead, keyboard navigation, and grouping.

### Basic Usage
```svelte
<script>
  let value = $state("");
</script>
<Select.Root type="single" bind:value>
  <Select.Trigger>Select option</Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Viewport>
        <Select.Item value="a" label="Option A" />
        <Select.Item value="b" label="Option B" />
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### Multiple Selection
```svelte
<script>
  let value = $state<string[]>([]);
</script>
<Select.Root type="multiple" bind:value>
  <!-- items -->
</Select.Root>
```

### Reusable Component
```svelte
<!-- MySelect.svelte -->
<script lang="ts">
  import { Select, type WithoutChildren } from "bits-ui";
  type Props = WithoutChildren<Select.RootProps> & {
    items: { value: string; label: string; disabled?: boolean }[];
  };
  let { value = $bindable(), items, ...rest }: Props = $props();
  const selectedLabel = $derived(items.find(i => i.value === value)?.label);
</script>
<Select.Root bind:value={value as never} {...rest}>
  <Select.Trigger>{selectedLabel}</Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Viewport>
        {#each items as { value, label, disabled }}
          <Select.Item {value} {label} {disabled} />
        {/each}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>

<!-- Usage -->
<script>
  import MySelect from "$lib/MySelect.svelte";
  let fruit = $state("apple");
</script>
<MySelect items={[{value: "apple", label: "Apple"}]} bind:value={fruit} />
```

### Scroll Buttons
```svelte
<Select.Content>
  <Select.ScrollUpButton />
  <Select.Viewport><!-- items --></Select.Viewport>
  <Select.ScrollDownButton />
</Select.Content>
```

Custom scroll delay:
```svelte
<script>
  import { cubicOut } from "svelte/easing";
  function delay(tick: number) {
    return 200 - (200 - 25) * cubicOut(Math.min(tick / 30, 1));
  }
</script>
<Select.ScrollUpButton {delay} />
```

### Positioning

Default uses Floating UI. Opt-out with `ContentStatic`:
```svelte
<Select.ContentStatic><!-- manual positioning --></Select.ContentStatic>
```

Custom anchor:
```svelte
<script>
  let anchor = $state<HTMLElement>(null!);
</script>
<div bind:this={anchor}></div>
<Select.Content customAnchor={anchor}>...</Select.Content>
```

### Highlighted Items
```svelte
<Select.Item class="data-highlighted:bg-blue-100" />
<Select.Item onHighlight={() => {}} onUnhighlight={() => {}} />
```

### Transitions
```svelte
<script>
  import { fly } from "svelte/transition";
</script>
<Select.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly><!-- content --></div>
      </div>
    {/if}
  {/snippet}
</Select.Content>
```

### Key Props

**Root**: `type` (required), `value`, `open`, `disabled`, `name`, `required`, `scrollAlignment`, `loop`, `allowDeselect`, `items`

**Content**: `side`, `sideOffset`, `align`, `alignOffset`, `avoidCollisions`, `preventScroll`, `customAnchor`, `forceMount`

**Item**: `value` (required), `label`, `disabled`

**ScrollUpButton/ScrollDownButton**: `delay`