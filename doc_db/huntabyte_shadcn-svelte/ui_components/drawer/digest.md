## Drawer Component

A Svelte drawer component built on Vaul Svelte, a port of Vaul by Emil Kowalski.

### Installation

```bash
npm install shadcn-svelte@latest add drawer
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

Combine Dialog and Drawer components to render Dialog on desktop (min-width: 768px) and Drawer on mobile using MediaQuery:

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

Main components: Root, Trigger, Content, Header, Title, Description, Footer, Close.