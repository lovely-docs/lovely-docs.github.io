A comprehensive collection of 60+ reusable Svelte UI components built on Bits UI, Embla Carousel, LayerChart, and other libraries. Each component is installed via `npx shadcn-svelte@latest add <component> -y -o` (flags: -y skips confirmation, -o overwrites existing files).

**Core Components:**
- **Accordion**: Vertically stacked expandable sections with single/multiple modes, WAI-ARIA accessible
- **Alert/AlertDialog**: Callout notifications and modal dialogs with variants (default, destructive)
- **Avatar**: Image with fallback text, composed of Root/Image/Fallback
- **Badge**: Styled badges with variants (default, secondary, destructive, outline), icon support
- **Breadcrumb**: Navigation path with Root/List/Item/Link/Page/Separator/Ellipsis, custom separators, dropdowns, responsive variants
- **Button**: Reusable button with variants (default, secondary, destructive, outline, ghost, link), sizes, icon support, href for links
- **ButtonGroup**: Groups related buttons with vertical/horizontal orientation, separators, nesting, composition with inputs/dropdowns/popovers

**Form Components:**
- **Checkbox**: Toggle control with checked/disabled states, data-[state=checked] styling, form integration
- **Input**: Text input with email/file/disabled/invalid states, labels, descriptions, validation
- **InputGroup**: Input/textarea wrapper with configurable addons (icons, text, buttons, tooltips, dropdowns, loading indicators), inline/block alignment
- **InputOTP**: Accessible OTP input with configurable length, pattern validation, separators, form integration
- **Label**: Accessible label with for attribute linking to form control id
- **RadioGroup**: Mutually exclusive selection with single-selection mode, form integration
- **Select**: Dropdown with single selection, grouping, state binding, form integration
- **Switch**: Toggle control with checked/disabled states, form integration
- **Textarea**: Multi-line text input with disabled state, labels, validation

**Layout & Structure:**
- **Card**: Composable card with Root/Header/Title/Description/Action/Content/Footer
- **Empty**: Empty state with Root/Header/Media/Title/Description/Content, icon/avatar variants, borders, gradients
- **Field**: Composable form field with labels, descriptions, errors, vertical/horizontal/responsive orientations, choice cards
- **Item**: Flex container for content with title/description/actions, variants (default, outline, muted), sizes, media types, grouping, link/dropdown integration
- **Separator**: Visual divider with horizontal/vertical orientation
- **Sidebar**: Composable sidebar with Provider/Root/Header/Content/Group/Menu/Footer/Trigger, left/right positioning, sidebar/floating/inset variants, offcanvas/icon/none collapse modes, useSidebar() hook, CSS variable theming

**Navigation & Menus:**
- **Breadcrumb**: Navigation hierarchy with custom separators, dropdowns, ellipsis for collapsed state, responsive desktop/mobile variants
- **DropdownMenu**: Menu triggered by button with items, checkboxes, radio groups, separators, nested submenus, keyboard shortcuts
- **Menubar**: Desktop menubar with Root/Menu/Trigger/Content/Item/Shortcut/Separator/Sub/CheckboxItem/RadioGroup, nested submenus
- **NavigationMenu**: Collection of navigation links with triggers, dropdowns, grid layouts, icons
- **Pagination**: Page navigation with configurable page count, items per page, sibling count, prev/next buttons, ellipsis

**Overlays & Popovers:**
- **Dialog**: Modal window with Root/Trigger/Content/Header/Title/Description/Footer
- **Drawer**: Slide-out panel (Vaul-based) with Root/Trigger/Content/Header/Title/Description/Footer/Close, responsive Dialog/Drawer switching
- **HoverCard**: Link preview on hover with Root/Trigger/Content
- **Popover**: Rich content portal triggered by button with Root/Trigger/Content
- **Sheet**: Dialog-based sheet with configurable side positioning (top/right/bottom/left), CSS-customizable sizing
- **Tooltip**: Popup on hover/focus with Provider/Root/Trigger/Content

**Data Display:**
- **Calendar**: Date selection with single/range modes, dropdown month/year selectors, popover integration, natural language parsing, 30+ block variants
- **Chart**: Composable charts on LayerChart with data/config (labels/colors), CSS variable theming, customizable tooltips
- **DataTable**: TanStack Table v8 integration with pagination, sorting, filtering, column visibility, row selection, cell formatting using Svelte 5 snippets
- **Progress**: Progress bar with value and max props
- **Skeleton**: Placeholder loader component, customize dimensions/shape via Tailwind classes
- **Table**: Responsive table with Root/Caption/Header/Body/Footer/Row/Head/Cell, colspan support, custom styling
- **Tabs**: Tabbed interface with Root/List/Trigger/Content, only one panel visible at a time

**Input Enhancements:**
- **AspectRatio**: Maintains content at specified ratio (e.g., 16/9)
- **Carousel**: Embla-based carousel with sizing (basis classes), spacing (pl-/ml- utilities), vertical/horizontal orientation, configurable options, API access via setApi callback, Autoplay plugin support
- **DatePicker**: Date picker combining Popover + Calendar/RangeCalendar for single dates, ranges, presets, form integration with date constraints
- **RangeCalendar**: Date range picker calendar with {start, end} value object binding
- **Resizable**: Resizable panel groups with horizontal/vertical direction, defaultSize percentages, nested pane support, optional handle indicators
- **ScrollArea**: Custom-styled scroll area with configurable orientation (vertical/horizontal/both)
- **Slider**: Range input with single/multiple thumbs, configurable max/step/orientation

**Specialized:**
- **Command**: Unstyled command menu with Root/Input/List/Group/Item/Separator/Shortcut/Dialog variants, keyboard shortcuts, disabled items, automatic icon styling
- **Combobox**: Searchable dropdown/autocomplete built from Popover + Command, $state/$derived for open/value, closeAndFocusTrigger() after selection, Form.Control for form integration
- **ContextMenu**: Right-click context menu with items, checkboxes, radio groups, separators, nested submenus, keyboard shortcuts
- **Collapsible**: Expandable/collapsible panel with Root/Trigger/Content
- **Form**: Form components wrapping Formsnap & Superforms with Zod validation, ARIA attributes, composable field structure (Field/Control/Label/Description/FieldErrors)
- **Kbd**: Keyboard input display, supports grouping and nesting in buttons/tooltips/input groups
- **NativeSelect**: Styled native HTML select with option groups, disabled/invalid states, accessibility features
- **Sonner**: Toast notifications with success/error variants, description, action callback
- **Spinner**: Loading indicator, customize size/color with utility classes, works in buttons/badges/input groups/items/empty states
- **Toggle**: Two-state button with variants (default, outline), sizes (sm/default/lg), disabled state, icon/text support
- **ToggleGroup**: Toggle group with single/multiple selection modes, size variants, outline styling, disabled state support
- **Typography**: Styling examples using Tailwind utilities for headings (h1-h4), paragraphs, blockquotes, code, lists, tables

**Installation Pattern:**
All components follow the same installation: `npx shadcn-svelte@latest add <component> -y -o`

**Key Patterns:**
- Composable subcomponents (Root/Trigger/Content/Item structure)
- Svelte 5 snippets and $state/$derived reactivity
- Tailwind CSS for styling
- Form integration with sveltekit-superforms and Zod validation
- Accessibility via ARIA attributes and semantic HTML
- Keyboard navigation support
- Dark mode support via CSS variables
- Responsive design patterns