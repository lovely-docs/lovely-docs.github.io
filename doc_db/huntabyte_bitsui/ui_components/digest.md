## UI Components Library

Complete collection of accessible, composable UI components for Svelte applications.

### Core Patterns

**State Management**: All components support two-way binding (`bind:value`) and fully controlled function bindings (`bind:value={getValue, setValue}`).

**Compound Components**: Components use sub-component architecture (Root, Trigger, Content, etc.) for maximum flexibility and customization.

**Data Attributes & CSS Variables**: Components expose `data-*` attributes for styling states and CSS variables for dynamic values.

### Component Categories

**Form Controls**
- Checkbox, Radio Group, Toggle, Switch - Binary/single selection
- Slider, Range Slider - Continuous value selection
- Select, Combobox - Dropdown selection with search/filtering
- PIN Input - OTP/2FA input with autofill support
- Rating Group - Star ratings with half-step support

**Date/Time Inputs**
- Calendar, Range Calendar - Date selection with constraints
- DateField, DateRangeField - Segment-based date input
- TimeField, TimeRangeField - Segment-based time input
- DatePicker, DateRangePicker - Combined field + calendar interface

**Disclosure Components**
- Accordion - Collapsible sections (single/multiple)
- Collapsible - Expandable content with transitions
- Tabs - Tabbed content organization

**Menus & Navigation**
- Dropdown Menu, Context Menu - Popup menus with items/groups/checkboxes/radio buttons
- Menubar - Horizontal menu bar with submenus
- Navigation Menu - Hierarchical navigation with dropdowns
- Command - Searchable command palette with keyboard navigation

**Dialogs & Overlays**
- Dialog - Modal with focus management and nested support
- Alert Dialog - Confirmation dialogs
- Popover - Floating panels with positioning
- Tooltip - Hover/focus triggered hints
- Link Preview - Link content preview on hover

**Progress & Feedback**
- Progress - Task completion status
- Meter - Static measurements within range
- Pagination - Page navigation

**Layout & Structure**
- Separator - Visual dividers
- Scroll Area - Custom scrollbars with hide delays
- Aspect Ratio - Maintains content aspect ratio
- Label - Enhanced label elements
- Button - Flexible button/anchor element
- Avatar - Image with loading states and fallback
- Toolbar - Action bar with toggle groups

### Key Features Across Components

**Accessibility**: WAI-ARIA compliant with keyboard navigation, screen reader support, and focus management.

**Positioning**: Floating UI integration for automatic collision detection and positioning (with manual alternatives).

**Animations**: `forceMount` prop with `child` snippet enables Svelte transitions on visibility changes.

**Keyboard Navigation**: Arrow keys, Enter, Escape, and component-specific shortcuts (vim bindings in Command, etc.).

**Validation**: Date/time components support min/max constraints, custom validation functions, and error callbacks.

**Form Integration**: Hidden inputs for form submission via `name` prop; `required` prop for validation.

**Customization**: Extensive snippet props for rendering, data attributes for styling, CSS variables for dynamic values.

### Common Patterns

**Reusable Wrappers**: Create wrapper components accepting items arrays and configuration props to reduce boilerplate.

**Scroll Management**: Combobox, Select, Command support scroll buttons with customizable delays or native scrollbars.

**Nested Structures**: Dialog, Menu, and Navigation components support nesting with depth tracking via CSS variables.

**Search/Filter**: Combobox and Command provide filtering with custom scoring algorithms or custom filter functions.

**Multi-Selection**: Select, Checkbox Group, Toggle Group support multiple values as arrays.