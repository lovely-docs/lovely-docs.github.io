## Hover Card

A component that displays preview content when users hover over a link, useful for showing additional information without navigation.

### Installation

```bash
npx shadcn-svelte@latest add hover-card -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>

<HoverCard.Root>
  <HoverCard.Trigger>Hover</HoverCard.Trigger>
  <HoverCard.Content>
    SvelteKit - Web development, streamlined
  </HoverCard.Content>
</HoverCard.Root>
```

### Complete Example with Avatar

```svelte
<script lang="ts">
  import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>

<HoverCard.Root>
  <HoverCard.Trigger
    href="https://github.com/sveltejs"
    target="_blank"
    rel="noreferrer noopener"
    class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
  >
    @sveltejs
  </HoverCard.Trigger>
  <HoverCard.Content class="w-80">
    <div class="flex justify-between space-x-4">
      <Avatar.Root>
        <Avatar.Image src="https://github.com/sveltejs.png" />
        <Avatar.Fallback>SK</Avatar.Fallback>
      </Avatar.Root>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">@sveltejs</h4>
        <p class="text-sm">Cybernetically enhanced web apps.</p>
        <div class="flex items-center pt-2">
          <CalendarDaysIcon class="mr-2 size-4 opacity-70" />
          <span class="text-muted-foreground text-xs">
            Joined September 2022
          </span>
        </div>
      </div>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
```

### Structure

- `HoverCard.Root`: Container component
- `HoverCard.Trigger`: The element that triggers the hover preview (can be a link with href, target, rel attributes)
- `HoverCard.Content`: The preview content displayed on hover (supports custom styling with class prop)

The component is built on Bits UI's link-preview component. See Bits UI documentation for full API reference.