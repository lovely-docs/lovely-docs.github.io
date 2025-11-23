## Drawer Component

Slide-out panel built on Vaul Svelte.

### Installation

```bash
npx shadcn-svelte@latest add drawer -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer/index.js";
</script>

<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Title</Drawer.Title>
      <Drawer.Description>Description</Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer>
      <Button>Submit</Button>
      <Drawer.Close>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

### Responsive Dialog/Drawer

Use `MediaQuery` to render Dialog on desktop and Drawer on mobile:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  
  let open = $state(false);
  const isDesktop = new MediaQuery("(min-width: 768px)");
</script>

{#if isDesktop.current}
  <Dialog.Root bind:open>
    <!-- Dialog content -->
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <!-- Drawer content -->
  </Drawer.Root>
{/if}
```