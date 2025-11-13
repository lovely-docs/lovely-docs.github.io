## June 2025
- Calendar and RangeCalendar components overhauled with month/year dropdown selectors
- 30+ Calendar blocks added for building custom calendar components

## May 2025
- Tailwind v4 support released with refreshed styles (demo at v4.shadcn-svelte.com)
- Migration guide available for upgrading from Tailwind v3
- Charts added as preview component (requires Svelte v5 + Tailwind v4 for CLI installation)
- Custom/remote registry support added - publish and share components via CLI

## March 2024
- Blocks introduced: ready-made, responsive, accessible, composable components
- New Breadcrumb component added
- New Scroll Area component added (built on Bits UI, supports vertical/horizontal scrolling)

## February 2024
- New Resizable component added (built on PaneForge)
- Icon imports updated: moved from radix-icons-svelte to svelte-radix, now using deep imports from @lucide/svelte/icons/check instead of @lucide/svelte for better dev server performance
- Major Formsnap rewrite: completely new flexible API, no direct migration path from old version, all Form components updated

## January 2024
- New Carousel component with example showing Card and Carousel composition
- New Drawer component (built on vaul-svelte, port of Emil Kowalski's React vaul)
- New Sonner component (built on svelte-sonner, port of Emil Kowalski's React Sonner) with toast example
- New Pagination component (built on Bits UI)

## December 2023
- New Calendar, Range Calendar, and Date Picker components added

## November 2023
- New Toggle Group component added

## October 2023
- New Command component: command palette built on cmdk-sv (Svelte port of cmdk)
- New Combobox component: searchable dropdown combining Command and Popover
- Form.Label changes: ids from getFormField() now a store, use $ids.input syntax
- New Form.Control component for wrapping non-traditional form elements, must be exported from form/index.ts