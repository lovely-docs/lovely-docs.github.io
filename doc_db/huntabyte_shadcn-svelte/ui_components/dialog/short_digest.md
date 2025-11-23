## Dialog

Modal window component that overlays content and renders underlying content inert.

### Installation

```bash
npx shadcn-svelte@latest add dialog -y -o
```

### Components

- `Dialog.Root` - Container
- `Dialog.Trigger` - Opens dialog
- `Dialog.Content` - Main container
- `Dialog.Header`, `Dialog.Title`, `Dialog.Description` - Header elements
- `Dialog.Footer` - Footer section

### Example

```svelte
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description text</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button type="submit">Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```