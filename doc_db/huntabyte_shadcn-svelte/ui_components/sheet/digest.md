## Sheet Component

A dialog-based component that displays complementary content sliding in from screen edges.

### Installation

```bash
npx shadcn-svelte@latest add sheet -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

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

### Structure

- `Sheet.Root` - Container
- `Sheet.Trigger` - Button to open the sheet
- `Sheet.Content` - Main content area
- `Sheet.Header` - Header section
- `Sheet.Title` - Title text
- `Sheet.Description` - Description text
- `Sheet.Footer` - Footer section (optional)
- `Sheet.Close` - Close button

### Side Property

Control which edge the sheet slides from using the `side` prop on `Sheet.Content`:

```svelte
<Sheet.Content side="right">
  <!-- content -->
</Sheet.Content>
```

Valid values: `top`, `right`, `bottom`, `left`

### Sizing

Adjust sheet width using CSS classes on `Sheet.Content`:

```svelte
<Sheet.Content class="w-[400px] sm:w-[540px]">
  <!-- content -->
</Sheet.Content>
```

### Complete Example

```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Sheet.Root>
  <Sheet.Trigger class={buttonVariants({ variant: "outline" })}>
    Open
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Edit profile</Sheet.Title>
      <Sheet.Description>
        Make changes to your profile here. Click save when you're done.
      </Sheet.Description>
    </Sheet.Header>
    <div class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" />
      </div>
      <div class="grid gap-3">
        <Label for="username" class="text-right">Username</Label>
        <Input id="username" value="@peduarte" />
      </div>
    </div>
    <Sheet.Footer>
      <Sheet.Close class={buttonVariants({ variant: "outline" })}>
        Save changes
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

Extends the Dialog component from bits-ui. See bits-ui Dialog documentation for full API reference.