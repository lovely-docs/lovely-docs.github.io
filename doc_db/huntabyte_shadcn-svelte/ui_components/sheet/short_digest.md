Dialog-based component for complementary content sliding from screen edges.

**Install:** `npx shadcn-svelte@latest add sheet -y -o`

**Basic structure:**
```svelte
<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description</Sheet.Description>
    </Sheet.Header>
    <Sheet.Footer>
      <Sheet.Close>Close</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

**Options:** `side` prop accepts `top|right|bottom|left`; customize size with CSS classes on `Sheet.Content`.