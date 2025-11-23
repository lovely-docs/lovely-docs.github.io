## Sidebar Component

Composable, themeable sidebar with collapse-to-icons support.

### Installation

```bash
npx shadcn-svelte@latest add sidebar -y -o
```

Add CSS variables to `src/app.css` (light and dark modes with oklch colors).

### Basic Setup

`src/routes/+layout.svelte`:
```svelte
<Sidebar.Provider>
  <AppSidebar />
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
```

`src/lib/components/app-sidebar.svelte`:
```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
</Sidebar.Root>
```

### Menu Example

```svelte
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
```

### Key Components

- `Sidebar.Provider` - Context provider, handles state
- `Sidebar.Root` - Main container (props: `side`, `variant`, `collapsible`)
- `Sidebar.Header/Footer` - Sticky sections
- `Sidebar.Content` - Scrollable area
- `Sidebar.Group` - Section with label, content, optional action
- `Sidebar.Menu/MenuItem/MenuButton/MenuAction/MenuSub` - Menu structure
- `Sidebar.MenuBadge` - Badge in menu item
- `Sidebar.MenuSkeleton` - Loading skeleton
- `Sidebar.Separator` - Visual separator
- `Sidebar.Trigger` - Toggle button
- `Sidebar.Rail` - Rail for toggling

### useSidebar Hook

```svelte
const sidebar = useSidebar();
sidebar.state; // "expanded" or "collapsed"
sidebar.open; // boolean
sidebar.isMobile; // boolean
sidebar.toggle(); // toggle
```

### Configuration

**Width:** Use `--sidebar-width` and `--sidebar-width-mobile` CSS variables or constants.

**Keyboard:** Change `SIDEBAR_KEYBOARD_SHORTCUT` constant (default: `"b"`).

**Collapsible modes:** `"offcanvas"` (slides), `"icon"` (collapses to icons), `"none"` (fixed).

**Variants:** `"sidebar"`, `"floating"`, `"inset"` (wrap content in `Sidebar.Inset`).

### Advanced

- Wrap `Sidebar.Group` or `Sidebar.Menu` in `Collapsible.Root` for collapsible sections
- Use `MenuButton` `child` snippet for custom elements (links, etc.)
- `MenuAction` works independently from `MenuButton`
- Controlled state with `bind:open` on `Sidebar.Provider`
- Style based on states: `group-data-[collapsible=icon]:hidden`, `peer-data-[active=true]/menu-button:opacity-100`