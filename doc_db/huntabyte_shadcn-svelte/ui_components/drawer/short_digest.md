## Drawer Component

Built on Vaul Svelte. Install with `npm install shadcn-svelte@latest add drawer`.

**Basic usage:**
```svelte
<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Title</Drawer.Title>
    </Drawer.Header>
    <Drawer.Footer>
      <Drawer.Close>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

**Responsive Dialog/Drawer:** Use MediaQuery to render Dialog on desktop and Drawer on mobile.