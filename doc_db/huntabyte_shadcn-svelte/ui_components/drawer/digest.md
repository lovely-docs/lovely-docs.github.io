## Drawer Component

A slide-out panel component built on Vaul Svelte (Svelte port of Vaul by Emil Kowalski).

### Installation

```bash
npx shadcn-svelte@latest add drawer -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

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

### Components

- `Drawer.Root` - Container
- `Drawer.Trigger` - Opens drawer
- `Drawer.Content` - Main content area
- `Drawer.Header` - Header section
- `Drawer.Title` - Title text
- `Drawer.Description` - Description text
- `Drawer.Footer` - Footer section
- `Drawer.Close` - Closes drawer

### Responsive Dialog/Drawer

Combine Dialog and Drawer to render Dialog on desktop (min-width: 768px) and Drawer on mobile:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  
  let open = $state(false);
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const id = $props.id();
</script>

{#if isDesktop.current}
  <Dialog.Root bind:open>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
      Edit Profile
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here. Click save when you're done.
        </Dialog.Description>
      </Dialog.Header>
      <form class="grid items-start gap-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input type="email" id="email-{id}" value="shadcn@example.com" />
        </div>
        <div class="grid gap-2">
          <Label for="username-{id}">Username</Label>
          <Input id="username-{id}" value="@shadcn" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Edit Profile
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="text-left">
        <Drawer.Title>Edit profile</Drawer.Title>
        <Drawer.Description>
          Make changes to your profile here. Click save when you're done.
        </Drawer.Description>
      </Drawer.Header>
      <form class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input type="email" id="email-{id}" value="shadcn@example.com" />
        </div>
        <div class="grid gap-2">
          <Label for="username-{id}">Username</Label>
          <Input id="username-{id}" value="@shadcn" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
      <Drawer.Footer class="pt-2">
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>
          Cancel
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
```

### Full Example with Chart

The documentation includes a complete example showing a drawer with interactive controls (plus/minus buttons) and an animated bar chart displaying goal data. The example demonstrates state management with `$state`, event handling, and integration with the layerchart library for data visualization.