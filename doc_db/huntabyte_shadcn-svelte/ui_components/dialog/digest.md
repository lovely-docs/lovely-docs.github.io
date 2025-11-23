## Dialog

A modal window overlaid on the primary window or another dialog, rendering underlying content inert.

### Installation

```bash
npx shadcn-svelte@latest add dialog -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import and compose dialog components:

```svelte
<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
</script>

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

### Components

- `Dialog.Root` - Container for the dialog
- `Dialog.Trigger` - Button or element that opens the dialog
- `Dialog.Content` - Main dialog container with styling
- `Dialog.Header` - Header section wrapper
- `Dialog.Title` - Dialog title
- `Dialog.Description` - Dialog description text
- `Dialog.Footer` - Footer section wrapper

### Example with Form

```svelte
<Dialog.Root>
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
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="username" class="text-right">Username</Label>
        <Input id="username" value="@peduarte" class="col-span-3" />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit">Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

Built on Bits UI dialog component. See Bits UI documentation for full API reference and advanced options.