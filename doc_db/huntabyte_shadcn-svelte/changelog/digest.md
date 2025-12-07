## June 2025
Calendar and RangeCalendar components overhauled with month/year dropdown selectors and 30+ Calendar blocks added.

## May 2025
**Tailwind v4 Support**: Official support landed with refreshed styles. Full migration guide available. Projects using Svelte v5 with Tailwind v3 continue to work until upgrade.

**Charts**: Added as preview component. Available via CLI for Svelte v5 + Tailwind v4 projects.

**Custom Registry Support**: Publish custom/remote components via shadcn-svelte CLI to share with community.

## March 2024
**Blocks**: Ready-made, fully responsive, accessible, composable components built using same principles as core components.

**New Components**: Breadcrumb, Scroll Area (built on Bits UI, supports vertical/horizontal scrolling).

## February 2024
**New Component: Resizable**: Built on PaneForge.

**Icon Imports Updated**: Moved from unmaintained `radix-icons-svelte` to `svelte-radix`. Changed from:
```ts
import { Check } from "@lucide/svelte";
```
to deep imports:
```ts
import Check from "@lucide/svelte/icons/check";
```
Deep imports prevent Vite from optimizing entire icon collections, only optimizing used icons. Significant dev server performance improvement.

**Major Forms Update**: Formsnap completely rewritten for flexibility and power. No direct migration path—update components to new API. All Form components updated. See Forms Examples page.

## January 2024
**New Component: Carousel**:
```svelte
<Carousel.Root class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5), i}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

**New Component: Drawer**: Built on vaul-svelte (Svelte port of vaul by Emil Kowalski). Includes header, description, content, footer with buttons.

**New Component: Sonner**: Svelte port of Sonner (by Emil Kowalski). Toast notifications:
```ts
import { toast } from "svelte-sonner";
toast.success("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: { label: "Undo", onClick: () => console.info("Undo") }
});
```

**New Component: Pagination**: Built on Bits UI Pagination component.

## December 2023
New components: Calendar, Range Calendar, Date Picker.

## November 2023
New component: Toggle Group.

## October 2023
**New Component: Command**: Command palette built on cmdk-sv (Svelte port of cmdk).

**New Component: Combobox**: Combination of Command + Popover for searchable dropdown.

**Form.Label Changes**: `ids` from `getFormField()` now a store, prefix with `$`:
```svelte
<Label for={$ids.input} class={cn($errors && "text-destructive", className)}>
  <slot />
</Label>
```

**Form.Control**: New formsnap component wraps non-traditional form elements. Export in `src/lib/ui/form/index.ts`:
```ts
const Control = FormPrimitive.Control;
export { Control, Control as FormControl };
```