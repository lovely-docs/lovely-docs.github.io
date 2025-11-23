## Spinner

A loading state indicator component.

### Installation

```bash
npx shadcn-svelte@latest add spinner -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>
<Spinner />
```

### Customization

Replace the default spinner icon by editing the component. The default uses a `LoaderIcon` with `animate-spin` class:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils.js";
  import LoaderIcon from "@lucide/svelte/icons/loader";
  import type { ComponentProps } from "svelte";
  type Props = ComponentProps<typeof LoaderIcon>;
  let { class: className, ...restProps }: Props = $props();
</script>
<LoaderIcon
  role="status"
  aria-label="Loading"
  class={cn("size-4 animate-spin", className)}
  {...restProps}
/>
```

### Examples

**Size**: Use `size-*` utility classes to adjust spinner size:
```svelte
<Spinner class="size-3" />
<Spinner class="size-4" />
<Spinner class="size-6" />
<Spinner class="size-8" />
```

**Color**: Use `text-*` utility classes to change color:
```svelte
<Spinner class="size-6 text-red-500" />
<Spinner class="size-6 text-green-500" />
<Spinner class="size-6 text-blue-500" />
```

**Button**: Add spinner to buttons to indicate loading state. Button component handles spacing:
```svelte
<Button disabled size="sm">
  <Spinner />
  Loading...
</Button>
```

**Badge**: Use inside Badge component:
```svelte
<Badge>
  <Spinner />
  Syncing
</Badge>
```

**Input Group**: Place spinners in `<InputGroup.Addon>`:
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Send a message..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

**Empty State**: Use in Empty component's Media slot:
```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <Spinner />
    </Empty.Media>
    <Empty.Title>Processing your request</Empty.Title>
  </Empty.Header>
</Empty.Root>
```

**Item**: Use in Item.Media to show loading state with progress:
```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <Spinner />
  </Item.Media>
  <Item.Content>
    <Item.Title>Downloading...</Item.Title>
    <Item.Description>129 MB / 1000 MB</Item.Description>
  </Item.Content>
  <Item.Footer>
    <Progress value={75} />
  </Item.Footer>
</Item.Root>
```