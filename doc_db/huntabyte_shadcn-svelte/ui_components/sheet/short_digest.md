## Sheet Component

Dialog-based component for displaying complementary content from screen edges.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add sheet
```

### Basic Usage
```svelte
<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description</Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
```

### Key Features
- `side` prop: `top`, `right`, `bottom`, `left`
- Size with CSS classes: `class="w-[400px] sm:w-[540px]"`
- Components: Root, Trigger, Content, Header, Title, Description, Footer, Close