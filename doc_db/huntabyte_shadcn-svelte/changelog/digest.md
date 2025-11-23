## June 2025

**Calendar Components Overhaul**
- `Calendar` and `RangeCalendar` components now support month/year dropdown selectors
- 30+ Calendar blocks added for building custom calendar components

## May 2025

**Tailwind v4 Support**
- Official Tailwind v4 support released with refreshed styles (demo at v4.shadcn-svelte.com)
- Full migration guide available; projects using Svelte v5 with Tailwind v3 continue to work until upgrade
- CLI supports adding components for Svelte v5 + Tailwind v4 projects

**Charts Component**
- Charts added as preview component (available via CLI for Svelte v5 + Tailwind v4)

**Custom Registry Support**
- Developers can now publish custom/remote components and share via shadcn-svelte CLI

## March 2024

**Blocks Introduction**
- Ready-made, fully responsive, accessible, composable components built using shadcn-svelte principles
- Note: v0 only supports React currently

**New Components: Breadcrumb, Scroll Area**
- `Breadcrumb`: Navigation component
- `Scroll Area`: Built on Bits UI, supports vertical and horizontal scrolling with consistent cross-browser experience

## February 2024

**New Component: Resizable**
- Built on PaneForge library (early stage)

**Icon Import Changes**
- Moved from unmaintained `radix-icons-svelte` to `svelte-radix` for new-york style
- Changed from: `import { Check } from "@lucide/svelte"`
- Changed to: `import Check from "@lucide/svelte/icons/check"`
- Deep imports prevent Vite from optimizing entire icon collections, significantly improving dev server performance

**Major Forms Update**
- Formsnap completely rewritten for flexibility and power
- Breaking changes: all `Form` components updated to new API
- No direct migration path; requires updating components to new API and latest formsnap/sveltekit-superforms versions
- Live examples available on Forms Examples page

## January 2024

**New Components: Carousel, Drawer, Sonner, Pagination**

**Carousel Example:**
```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
</script>
<Carousel.Root class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5), i}
      <Carousel.Item>
        <div class="p-1">
          <Card.Root>
            <Card.Content class="flex aspect-square items-center justify-center p-6">
              <span class="text-4xl font-semibold">{i + 1}</span>
            </Card.Content>
          </Card.Root>
        </div>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

**Drawer**
- Built on vaul-svelte (Svelte port of vaul by Emil Kowalski)
- Example with goal adjustment:
```svelte
<script lang="ts">
  import MinusIcon from "@lucide/svelte/icons/minus";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  
  let goal = $state(350);
  function handleClick(adjustment: number) {
    goal = Math.max(200, Math.min(400, goal + adjustment));
  }
</script>
<Drawer.Root>
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open Drawer</Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full max-w-sm">
      <Drawer.Header>
        <Drawer.Title>Move Goal</Drawer.Title>
        <Drawer.Description>Set your daily activity goal.</Drawer.Description>
      </Drawer.Header>
      <div class="p-4 pb-0">
        <div class="flex items-center justify-center space-x-2">
          <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full" onclick={() => handleClick(-10)} disabled={goal <= 200}>
            <MinusIcon />
            <span class="sr-only">Decrease</span>
          </Button>
          <div class="flex-1 text-center">
            <div class="text-7xl font-bold tracking-tighter">{goal}</div>
            <div class="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
          </div>
          <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full" onclick={() => handleClick(10)} disabled={goal >= 400}>
            <PlusIcon />
            <span class="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <Drawer.Footer>
        <Button>Submit</Button>
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
      </Drawer.Footer>
    </div>
  </Drawer.Content>
</Drawer.Root>
```

**Sonner**
- Svelte port of Sonner (by Emil Kowalski)
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button variant="outline" onclick={() => toast.success("Event has been created", { description: "Sunday, December 03, 2023 at 9:00 AM", action: { label: "Undo", onClick: () => console.info("Undo") } })}>
  Show Toast
</Button>
```

**Pagination**
- Built on Bits UI Pagination component

## December 2023

**New Components: Calendar, Range Calendar, Date Picker**

## November 2023

**New Component: Toggle Group**

## October 2023

**New Components: Command, Combobox**

**Command**
- Command palette component built on cmdk-sv (Svelte port of cmdk)
- Library in early stage

**Combobox**
- Combination of Command and Popover components
- Creates searchable dropdown menu

**Form Updates**

**Form.Label Changes**
- `ids` from `getFormField()` is now a store, must be prefixed with `$`:
```svelte
<Label for={$ids.input} class={cn($errors && "text-destructive", className)} {...$$restProps}>
  <slot />
</Label>
```

**Form.Control**
- New Formsnap component for wrapping non-traditional form elements
- Export in `src/lib/ui/form/index.ts`:
```ts
const Control = FormPrimitive.Control;
export { Control, Control as FormControl };
```