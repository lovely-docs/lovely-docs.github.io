## UI Components Library

A comprehensive collection of 60+ composable, accessible UI components built on Bits UI, Embla Carousel, Vaul, and other primitives. All components support Tailwind CSS styling and integrate with SvelteKit forms.

### Installation
```bash
npx shadcn-svelte@latest add <component> -y -o
```
Flags: `-y` skips confirmation, `-o` overwrites existing files.

### Core Components

**Layout & Structure**
- **Sidebar**: Collapsible sidebar with icon mode, multiple variants (sidebar/floating/inset), menu system, header/footer, theming via CSS variables
- **Card**: Composable sections (Root, Header, Title, Description, Action, Content, Footer)
- **Resizable**: Horizontal/vertical pane groups with nested layout support
- **Scroll Area**: Custom cross-browser scrolling with vertical/horizontal/bidirectional orientation
- **Separator**: Horizontal or vertical content dividers
- **Empty**: Empty state display with icon/avatar/image media variants

**Navigation**
- **Breadcrumb**: Path navigation with custom separators, dropdown/drawer integration, responsive collapsed states
- **Navigation Menu**: Grid-based navigation with descriptions, icons, and snippet-based children
- **Pagination**: Page navigation with prev/next buttons and ellipsis
- **Tabs**: Tabbed interface with single active panel
- **Menubar**: Desktop application-style menu with File/Edit/View structure

**Forms & Input**
- **Input**: Text/email/file inputs with labels and validation states
- **Textarea**: Multi-line text input with form integration
- **Label**: Accessible form labels with `for` attribute binding
- **Checkbox**: Toggle control with checked/disabled states, form integration
- **Radio Group**: Mutually exclusive selection with form binding
- **Switch**: Binary toggle control
- **Select**: Dropdown with single selection, grouping, dynamic options
- **Native Select**: Styled HTML select wrapper with OptGroup support
- **Input OTP**: One-time password input with configurable length and separators
- **Input Group**: Attach icons, text, buttons to inputs with flexible alignment (inline-end, block-start, block-end)
- **Slider**: Single/multiple thumb range input with vertical/horizontal orientation
- **Toggle**: Two-state button with variants and sizes
- **Toggle Group**: Multiple toggles with single/multiple selection modes
- **Field**: Composable form field wrapper with labels, descriptions, errors, validation states; supports vertical/horizontal/responsive layouts

**Dialogs & Overlays**
- **Dialog**: Modal overlay with header, title, description, footer
- **Alert Dialog**: Modal for important interruptions requiring response
- **Drawer**: Slide-out panel from screen edges (top/right/bottom/left)
- **Popover**: Rich content portal triggered by button
- **Hover Card**: Link preview on hover with avatar/content
- **Sheet**: Dialog-based complementary content from edges
- **Tooltip**: Popup on hover/focus with Provider/Root/Trigger/Content structure

**Dropdowns & Menus**
- **Dropdown Menu**: Menu with items, groups, separators, shortcuts, submenus, checkboxes, radio groups
- **Context Menu**: Right-click menu with nested submenus and state bindings
- **Combobox**: Autocomplete input composed from Popover + Command with status indicators

**Data Display**
- **Table**: Responsive table with Header/Body/Footer/Row/Head/Cell components
- **Data Table**: TanStack Table v8 integration with sorting, filtering, pagination, column visibility, row selection
- **Carousel**: Embla Carousel with sizing, spacing, vertical/horizontal orientation, plugins, reactive API
- **Chart**: LayerChart-based charts with customizable config, CSS variable theming, flexible tooltips
- **Badge**: Multiple variants (default/secondary/destructive/outline) with custom styling
- **Avatar**: Image with fallback text, supports groups with overlapping display
- **Item**: Flex container for content with title/description/media/actions; supports variants (default/outline/muted) and sizes

**Feedback & Status**
- **Alert**: Callout with default/destructive variants, icon support
- **Progress**: Visual progress bar with reactive value binding
- **Spinner**: Loading indicator with customizable size/color
- **Sonner**: Toast notifications with success/error types, descriptions, action buttons, dark mode support

**Utilities**
- **Accordion**: Vertically stacked interactive headings with single/multiple type, WAI-ARIA accessible
- **Aspect Ratio**: Maintains content at specified ratio (e.g., 16/9)
- **Button**: Multiple variants (outline/secondary/destructive/ghost/link), href support, icon/size props
- **Button Group**: Groups related buttons with consistent styling, separators, nesting, integration with Input/DropdownMenu/Select/Popover
- **Collapsible**: Expand/collapse panel with Trigger and Content
- **Calendar**: Date selection with single/multi-month display, dropdown captions, timezone support
- **Date Picker**: Popover + Calendar composition with single/range selection, presets, form integration
- **Range Calendar**: Date range picker with start/end properties
- **Kbd**: Keyboard key display, groups multiple keys together
- **Skeleton**: Placeholder for loading states

### Form Integration

All form components integrate with **sveltekit-superforms** and **Zod** for type-safe validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const schema = z.object({ username: z.string().min(2) });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  const form = superForm(defaults(zod4(schema)), {
    validators: zod4(schema),
    SPA: true
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>Public display name</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### Composition Pattern

Components use composable sub-components:
```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
```

### Accessibility

- WAI-ARIA compliant with proper roles and attributes
- Keyboard navigation support
- Screen reader friendly
- Form validation with error messages
- Semantic HTML structure

### Theming

- Tailwind CSS utility classes for styling
- CSS variables for component-specific theming (e.g., sidebar colors)
- Dark mode support via class or system preference
- Customizable via `class` prop on most components
