## Alert Dialog

Modal dialog component that interrupts the user with important content and expects a response.

### Installation

```bash
npx shadcn-svelte@latest add alert-dialog -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Show Dialog
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Components

- `AlertDialog.Root` - Root container
- `AlertDialog.Trigger` - Button that opens the dialog
- `AlertDialog.Content` - Dialog content wrapper
- `AlertDialog.Header` - Header section
- `AlertDialog.Title` - Dialog title
- `AlertDialog.Description` - Dialog description text
- `AlertDialog.Footer` - Footer section
- `AlertDialog.Cancel` - Cancel button
- `AlertDialog.Action` - Action/confirm button

See Bits UI documentation for full API reference.