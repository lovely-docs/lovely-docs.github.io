## Installation

Install with `pnpm dlx shadcn-svelte@latest add sidebar` and add CSS variables for theming:

```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}
.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

## Structure

Sidebar is composed of: `Sidebar.Provider` (handles collapsible state), `Sidebar.Root` (container), `Sidebar.Header`/`Sidebar.Footer` (sticky), `Sidebar.Content` (scrollable), `Sidebar.Group` (sections), `Sidebar.Trigger` (toggle button).

## Basic Setup

Wrap your app in `Sidebar.Provider` at the root layout:

```svelte
<Sidebar.Provider>
  <AppSidebar />
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
```

Create `AppSidebar` component:

```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
</Sidebar.Root>
```

## Building a Menu

Use `Sidebar.Menu` with `Sidebar.MenuItem` and `Sidebar.MenuButton` to create menu items:

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

## Sidebar.Root Props

- `side`: `"left"` or `"right"` - sidebar position
- `variant`: `"sidebar"`, `"floating"`, or `"inset"` - layout style (use `Sidebar.Inset` wrapper for `inset` variant)
- `collapsible`: `"offcanvas"`, `"icon"`, or `"none"` - collapse behavior

## Sidebar.Provider Props

- `open`: `boolean` - open state (bindable)
- `onOpenChange`: `(open: boolean) => void` - state change callback

Set sidebar width with CSS variables: `--sidebar-width` and `--sidebar-width-mobile` in style prop.

Keyboard shortcut is `cmd+b` (Mac) or `ctrl+b` (Windows), configurable via `SIDEBAR_KEYBOARD_SHORTCUT` constant.

## useSidebar Hook

Access sidebar context with `const sidebar = useSidebar()`. Returns reactive object with properties:
- `state`: `"expanded"` or `"collapsed"`
- `open`: `boolean`
- `setOpen(open: boolean)`: set open state
- `openMobile`: `boolean`
- `setOpenMobile(open: boolean)`: set mobile open state
- `isMobile`: `boolean`
- `toggle()`: toggle sidebar

## Components

**Sidebar.Header/Footer**: Sticky sections at top/bottom. Can contain menus or dropdowns.

**Sidebar.Content**: Scrollable container for groups.

**Sidebar.Group**: Section with `GroupLabel`, `GroupContent`, and optional `GroupAction`. Wrap in `Collapsible.Root` to make collapsible.

**Sidebar.Menu**: Menu container with `MenuItem`, `MenuButton`, `MenuAction`, `MenuSub` components.

**Sidebar.MenuButton**: Renders button or custom element via `child` snippet. Use `isActive` prop to mark as active. Render icon and label inside.

**Sidebar.MenuAction**: Independent button in menu item, works with `DropdownMenu` for context menus.

**Sidebar.MenuSub**: Submenu using `MenuSubItem` and `MenuSubButton`.

**Sidebar.MenuBadge**: Badge component for menu items.

**Sidebar.MenuSkeleton**: Loading skeleton for menu items.

**Sidebar.Separator**: Visual separator.

**Sidebar.Trigger**: Toggle button (must be inside `Sidebar.Provider`).

**Sidebar.Rail**: Rail component to toggle sidebar.

## Custom Trigger

Create custom trigger with `useSidebar` hook:

```svelte
<script lang="ts">
  const sidebar = useSidebar();
</script>
<button onclick={() => sidebar.toggle()}>Toggle</button>
```

## Controlled Sidebar

Use Svelte's function binding to control state:

```svelte
<script lang="ts">
  let myOpen = $state(true);
</script>
<Sidebar.Provider bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
  <Sidebar.Root />
</Sidebar.Provider>
```

## Styling Tips

- Hide elements in `icon` mode: `class="group-data-[collapsible=icon]:hidden"`
- Show menu action when button is active: `class="peer-data-[active=true]/menu-button:opacity-100"`