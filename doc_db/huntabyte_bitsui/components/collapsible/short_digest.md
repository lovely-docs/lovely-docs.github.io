## Overview
Expandable/collapsible content component with accessibility, transitions, and browser search integration.

## Basic Usage
```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
</script>
<Collapsible.Root>
  <Collapsible.Trigger>
    <CaretUpDown />
  </Collapsible.Trigger>
  <Collapsible.Content>
    Content here
  </Collapsible.Content>
</Collapsible.Root>
```

## State Management
Two-way binding: `bind:open={isOpen}`
Fully controlled: `bind:open={getOpen, setOpen}` (function binding)

## Transitions
Use `forceMount` prop with `child` snippet for Svelte transitions:
```svelte
<Collapsible.Content forceMount>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade>Content</div>
    {/if}
  {/snippet}
</Collapsible.Content>
```

## Hidden Until Found
`hiddenUntilFound` prop enables browser find-in-page to auto-expand collapsed content.

## API
**Root**: `open`, `onOpenChange`, `onOpenChangeComplete`, `disabled`, `ref`, `children`, `child`
**Trigger**: `ref`, `children`, `child`
**Content**: `forceMount`, `hiddenUntilFound`, `ref`, `children`, `child`

Data attributes: `data-state` ('open'|'closed'), `data-disabled`, `data-collapsible-*`
CSS variables: `--bits-collapsible-content-height`, `--bits-collapsible-content-width`