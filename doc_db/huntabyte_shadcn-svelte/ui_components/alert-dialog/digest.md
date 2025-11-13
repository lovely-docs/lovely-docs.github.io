## Alert Dialog Component

A modal dialog component that interrupts the user with important content and expects a response.

### Installation

```bash
npm install shadcn-svelte@latest add alert-dialog
```

### Usage

Import and compose the component:

```svelte
<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>Open</AlertDialog.Trigger>
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

The component uses a composition pattern with sub-components: Root (container), Trigger (opens dialog), Content (modal container), Header/Title/Description (content structure), Footer (action buttons), Cancel and Action buttons.