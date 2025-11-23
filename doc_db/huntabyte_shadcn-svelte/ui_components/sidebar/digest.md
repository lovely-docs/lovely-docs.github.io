## Sidebar Component

A composable, themeable, and customizable sidebar component that collapses to icons. Sidebars are complex with many moving parts; this component provides a solid foundation built from 30+ configurations.

### Installation

```bash
npx shadcn-svelte@latest add sidebar -y -o
```

Add CSS variables to `src/app.css`:
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

### Structure

- `Sidebar.Provider` - Handles collapsible state
- `Sidebar.Root` - Sidebar container
- `Sidebar.Header` / `Sidebar.Footer` - Sticky at top/bottom
- `Sidebar.Content` - Scrollable content
- `Sidebar.Group` - Section within content
- `Sidebar.Trigger` - Toggle button

### Basic Setup

`src/routes/+layout.svelte`:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  let { children } = $props();
</script>
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
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
</script>
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
</Sidebar.Root>
```

### First Sidebar with Menu

```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import HouseIcon from "@lucide/svelte/icons/house";
  import InboxIcon from "@lucide/svelte/icons/inbox";
  
  const items = [
    { title: "Home", url: "#", icon: HouseIcon },
    { title: "Inbox", url: "#", icon: InboxIcon },
  ];
</script>
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
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

### Sidebar.Provider

Provides sidebar context. Wrap your application in it.

**Props:**
- `open` (boolean, bindable) - Open state
- `onOpenChange` ((open: boolean) => void) - Callback fired after state changes

**Width Configuration:**

Use `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` constants in `src/lib/components/ui/sidebar/constants.ts` (default: `16rem` and `18rem`).

For multiple sidebars, use CSS variables:
```svelte
<Sidebar.Provider style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;">
  <Sidebar.Root />
</Sidebar.Provider>
```

**Keyboard Shortcut:**

Change `SIDEBAR_KEYBOARD_SHORTCUT` in constants file (default: `"b"` for cmd+b on Mac, ctrl+b on Windows).

### Sidebar.Root

Main sidebar component.

**Props:**
- `side` - `"left"` or `"right"` (default: left)
- `variant` - `"sidebar"`, `"floating"`, or `"inset"`
- `collapsible` - `"offcanvas"`, `"icon"`, or `"none"`

For `inset` variant, wrap main content in `Sidebar.Inset`:
```svelte
<Sidebar.Provider>
  <Sidebar.Root variant="inset">
    <Sidebar.Inset>
      <main></main>
    </Sidebar.Inset>
  </Sidebar.Root>
</Sidebar.Provider>
```

### useSidebar Hook

Access sidebar context (cannot be destructured, must be called during component lifecycle):

```svelte
<script lang="ts">
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  const sidebar = useSidebar();
  sidebar.state; // "expanded" or "collapsed"
  sidebar.open; // boolean
  sidebar.setOpen(boolean);
  sidebar.openMobile; // boolean on mobile
  sidebar.setOpenMobile(boolean);
  sidebar.isMobile; // boolean
  sidebar.toggle(); // toggle desktop and mobile
</script>
```

### Sidebar.Header / Sidebar.Footer

Sticky header and footer. Example with dropdown menu:

```svelte
<Sidebar.Header>
  <Sidebar.Menu>
    <Sidebar.MenuItem>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Sidebar.MenuButton {...props}>
              Select Workspace
              <ChevronDown class="ml-auto" />
            </Sidebar.MenuButton>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
          <DropdownMenu.Item><span>Acme Inc</span></DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Sidebar.MenuItem>
  </Sidebar.Menu>
</Sidebar.Header>
```

### Sidebar.Content

Scrollable container for `Sidebar.Group` components.

### Sidebar.Group

Section within sidebar. Contains `GroupLabel`, `GroupContent`, and optional `GroupAction`:

```svelte
<Sidebar.Group>
  <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
  <Sidebar.GroupAction title="Add Project">
    <Plus /> <span class="sr-only">Add Project</span>
  </Sidebar.GroupAction>
  <Sidebar.GroupContent></Sidebar.GroupContent>
</Sidebar.Group>
```

**Collapsible Group:**

Wrap in `Collapsible.Root`:
```svelte
<Collapsible.Root open class="group/collapsible">
  <Sidebar.Group>
    <Sidebar.GroupLabel>
      {#snippet child({ props })}
        <Collapsible.Trigger {...props}>
          Help
          <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </Collapsible.Trigger>
      {/snippet}
    </Sidebar.GroupLabel>
    <Collapsible.Content>
      <Sidebar.GroupContent />
    </Collapsible.Content>
  </Sidebar.Group>
</Collapsible.Root>
```

### Sidebar.Menu

Menu component composed of `MenuItem`, `MenuButton`, `MenuAction`, and `MenuSub`.

**MenuButton:**

Renders a button by default, use `child` snippet for custom elements:
```svelte
<Sidebar.MenuButton isActive>
  {#snippet child({ props })}
    <a href="/home" {...props}>
      <House />
      <span>Home</span>
    </a>
  {/snippet}
</Sidebar.MenuButton>
```

Props: `isActive` (boolean) - marks item as active

**MenuAction:**

Independent button within menu item, works with `DropdownMenu`:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton>
    {#snippet child({ props })}
      <a href="/home" {...props}>
        <House />
        <span>Home</span>
      </a>
    {/snippet}
  </Sidebar.MenuButton>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Sidebar.MenuAction {...props}>
          <Ellipsis />
        </Sidebar.MenuAction>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content side="right" align="start">
      <DropdownMenu.Item><span>Edit</span></DropdownMenu.Item>
      <DropdownMenu.Item><span>Delete</span></DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Sidebar.MenuItem>
```

**MenuSub:**

Submenu using `MenuSubItem` and `MenuSubButton`:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuSub>
    <Sidebar.MenuSubItem>
      <Sidebar.MenuSubButton />
    </Sidebar.MenuSubItem>
  </Sidebar.MenuSub>
</Sidebar.MenuItem>
```

**Collapsible Menu:**

Wrap in `Collapsible.Root`:
```svelte
<Sidebar.Menu>
  <Collapsible.Root open class="group/collapsible">
    <Sidebar.MenuItem>
      <Collapsible.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton {...props} />
        {/snippet}
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Sidebar.MenuSub>
          <Sidebar.MenuSubItem />
        </Sidebar.MenuSub>
      </Collapsible.Content>
    </Sidebar.MenuItem>
  </Collapsible.Root>
</Sidebar.Menu>
```

### Sidebar.MenuBadge

Badge within menu item:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuBadge>24</Sidebar.MenuBadge>
</Sidebar.MenuItem>
```

### Sidebar.MenuSkeleton

Loading skeleton for menu items:
```svelte
<Sidebar.Menu>
  {#each Array.from({ length: 5 }) as _, index (index)}
    <Sidebar.MenuItem>
      <Sidebar.MenuSkeleton />
    </Sidebar.MenuItem>
  {/each}
</Sidebar.Menu>
```

### Sidebar.Separator

Separator within sidebar:
```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Separator />
  <Sidebar.Content>
    <Sidebar.Group />
    <Sidebar.Separator />
    <Sidebar.Group />
  </Sidebar.Content>
</Sidebar.Root>
```

### Sidebar.Trigger

Toggle button (must be within `Sidebar.Provider`):
```svelte
<Sidebar.Provider>
  <Sidebar.Root />
  <main>
    <Sidebar.Trigger />
  </main>
</Sidebar.Provider>
```

**Custom Trigger:**

Use `useSidebar` hook:
```svelte
<script lang="ts">
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  const sidebar = useSidebar();
</script>
<button onclick={() => sidebar.toggle()}>Toggle Sidebar</button>
```

### Sidebar.Rail

Rail component for toggling sidebar:
```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
  <Sidebar.Rail />
</Sidebar.Root>
```

### Controlled Sidebar

Use Svelte's function binding:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  let myOpen = $state(true);
</script>
<Sidebar.Provider bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
  <Sidebar.Root />
</Sidebar.Provider>
```

Or simpler:
```svelte
<Sidebar.Provider bind:open>
  <Sidebar.Root />
</Sidebar.Provider>
```

### Theming

CSS variables (use different variables from main app for distinct styling):
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

### Styling Tips

Hide element in icon mode:
```svelte
<Sidebar.Root collapsible="icon">
  <Sidebar.Content>
    <Sidebar.Group class="group-data-[collapsible=icon]:hidden" />
  </Sidebar.Content>
</Sidebar.Root>
```

Show menu action when button is active:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuAction class="peer-data-[active=true]/menu-button:opacity-100" />
</Sidebar.MenuItem>
```