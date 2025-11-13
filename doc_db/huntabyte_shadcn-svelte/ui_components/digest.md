## UI Components Library

Complete collection of composable, accessible UI components for Svelte applications built on Bits UI and other primitives.

### Core Components

**Layout & Structure**
- `Card` - Composable sections (Header, Title, Description, Content, Footer)
- `Container` - Flex container with media, title, description, actions
- `Empty` - Empty state display with media, title, description
- `Sidebar` - Collapsible sidebar with menu, groups, and provider state management
- `Resizable` - Draggable panel layouts with keyboard support

**Navigation**
- `Breadcrumb` - Hierarchical navigation with custom separators and dropdowns
- `Navigation Menu` - Website navigation with triggers and collapsible content
- `Pagination` - Page navigation with customizable items per page
- `Tabs` - Tabbed interface with triggers and content panels
- `Menubar` - Desktop application menu with checkboxes, radio groups, submenus

**Forms & Input**
- `Input` - Text input with validation support
- `Textarea` - Multi-line text input
- `Checkbox` - Toggle control with label support
- `Radio Group` - Mutually exclusive options
- `Switch` - Boolean toggle control
- `Select` - Dropdown with single/multiple selection and grouping
- `Native Select` - Styled HTML select element
- `Combobox` - Searchable dropdown combining Popover and Command
- `Input OTP` - One-time password input with copy-paste
- `Input Group` - Prefix/suffix containers for inputs with icons, buttons, text
- `Slider` - Range input with single/multiple values
- `Field` - Composable form field with label, description, error states
- `Form` - Type-safe forms with Formsnap, Superforms, and Zod validation

**Dialogs & Overlays**
- `Dialog` - Modal window overlay
- `Alert Dialog` - Modal for important messages requiring confirmation
- `Drawer` - Slide-in panel from screen edges
- `Sheet` - Dialog-based content from edges with positioning
- `Popover` - Portal content triggered by button
- `Hover Card` - Preview content on hover
- `Command` - Command menu/palette with dialog variant
- `Context Menu` - Right-click menu with items, submenus, checkboxes, radio groups

**Data Display**
- `Table` - Responsive table with headers, rows, cells, footer
- `Data Table` - TanStack Table v8 with pagination, sorting, filtering, column visibility, row selection
- `Carousel` - Embla Carousel with sizing, spacing, orientation, API access, plugins
- `Calendar` - Date selection with single dates, multiple months, dropdowns
- `Range Calendar` - Date range picker
- `Date Picker` - Popover-based date picker with presets
- `Chart` - LayerChart-based charts with composition design and theming
- `Badge` - Styled badges with variants (default, secondary, destructive, outline)
- `Avatar` - Image with text fallback
- `Progress` - Task completion progress bar
- `Skeleton` - Loading state placeholder

**Buttons & Controls**
- `Button` - Reusable button with variants, sizes, link rendering
- `Button Group` - Grouped buttons with separators and orientation
- `Toggle` - Two-state button
- `Toggle Group` - Multiple two-state buttons with single/multiple selection
- `Kbd` - Keyboard input display

**Feedback & Status**
- `Alert` - Callout messages with icons, titles, descriptions, variants
- `Sonner` - Toast notifications with success/error types, descriptions, actions
- `Spinner` - Animated loading indicator

**Utilities**
- `Aspect Ratio` - Content constraint to specific aspect ratio
- `Label` - Accessible form label
- `Separator` - Visual content divider (horizontal/vertical)
- `Scroll Area` - Custom-styled scrollable container
- `Tooltip` - Information popup on hover/focus
- `Collapsible` - Expand/collapse panel
- `Accordion` - Vertically stacked collapsible sections
- `Typography` - Tailwind utility classes for text styling

### Installation & Usage

Install components via CLI:
```bash
npm install shadcn-svelte@latest add [component-name]
```

Components use composition pattern with sub-components:
```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
```

### Key Features

- **Accessibility**: WAI-ARIA patterns, keyboard navigation, screen reader support
- **Composition**: Build complex UIs by combining sub-components
- **Form Integration**: Works with sveltekit-superforms and Zod validation
- **Theming**: CSS variables for customization, dark mode support
- **Responsive**: Mobile-first design with Tailwind CSS utilities
- **Type-Safe**: Full TypeScript support
- **Snippets**: Svelte 5 snippet support for flexible rendering
- **Icons**: Integration with lucide-svelte icons