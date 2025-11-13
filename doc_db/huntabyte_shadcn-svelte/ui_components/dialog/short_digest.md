## Dialog Component

Modal overlay component with `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Title`, `Dialog.Description`, and `Dialog.Footer` subcomponents.

Installation: `pnpm dlx shadcn-svelte@latest add dialog`

```svelte
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```