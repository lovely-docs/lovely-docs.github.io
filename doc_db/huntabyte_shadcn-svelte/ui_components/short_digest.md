## UI Components

Complete composable component library for Svelte with 60+ components including forms, dialogs, tables, navigation, and data display. Built on Bits UI primitives with accessibility, theming, and form validation support.

**Installation:** `npm install shadcn-svelte@latest add [component]`

**Key categories:** Forms (Input, Select, Checkbox, Radio, Switch, Combobox), Dialogs (Dialog, Drawer, Popover, Sheet), Navigation (Breadcrumb, Tabs, Pagination, Sidebar), Data (Table, DataTable, Carousel, Calendar, Chart), Feedback (Alert, Toast, Progress), Utilities (Button, Badge, Avatar, Tooltip, Skeleton)

**Pattern:** Composition-based with sub-components:
```svelte
<Card.Root>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Content>Content</Card.Content>
</Card.Root>
```