## Sheet

A dialog-based component that displays complementary content sliding in from screen edges.

**Installation:**
```bash
npx shadcn-svelte@latest add sheet -y -o
```
(-y: skip confirmation, -o: overwrite existing files)

**Basic usage:**
```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
</script>
<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description text</Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
```

**Side positioning:** Pass `side` prop to `<Sheet.Content />` with values: `top`, `right`, `bottom`, or `left`.

**Size customization:** Use CSS classes on `<Sheet.Content />`:
```svelte
<Sheet.Content class="w-[400px] sm:w-[540px]">
```

**Complete example with form:**
```svelte
<Sheet.Root>
  <Sheet.Trigger class={buttonVariants({ variant: "outline" })}>Open</Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Edit profile</Sheet.Title>
      <Sheet.Description>Make changes to your profile here.</Sheet.Description>
    </Sheet.Header>
    <div class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <Label for="name">Name</Label>
        <Input id="name" value="Pedro Duarte" />
      </div>
      <div class="grid gap-3">
        <Label for="username">Username</Label>
        <Input id="username" value="@peduarte" />
      </div>
    </div>
    <Sheet.Footer>
      <Sheet.Close class={buttonVariants({ variant: "outline" })}>Save changes</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

Extends Dialog component. See bits-ui Dialog docs for full API reference.