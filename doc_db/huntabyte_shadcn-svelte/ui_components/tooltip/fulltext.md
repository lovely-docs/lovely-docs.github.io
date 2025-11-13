# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

[Docs](https://bits-ui.com/docs/components/tooltip)

[API Reference](https://bits-ui.com/docs/components/tooltip#api-reference)

```svelte
<script lang="ts">
  import { buttonVariants } from "../ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger class={buttonVariants({ variant: "outline" })}
      >Hover</Tooltip.Trigger
    >
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Installation

```bash
pnpm dlx shadcn-svelte@latest add tooltip
```

```bash
npx shadcn-svelte@latest add tooltip
```

```bash
bun x shadcn-svelte@latest add tooltip
```

## Usage

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>Hover</Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```