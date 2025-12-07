## Sidebar Component

Composable, themeable sidebar with collapse-to-icons support.

### Installation
```bash
npx shadcn-svelte@latest add sidebar -y -o
```

Add CSS variables for theming (light/dark modes with oklch colors).

### Basic Structure
```svelte
<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header />
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Label</Sidebar.GroupLabel>
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
    <Sidebar.Footer />
  </Sidebar.Root>
  <main>
    <Sidebar.Trigger />
  </main>
</Sidebar.Provider>
```

### Key Components

**Sidebar.Provider** - Context wrapper. Props: `open` (bindable), `onOpenChange` callback. Configure width with `--sidebar-width` CSS var or constants.

**Sidebar.Root** - Main container. Props: `side` (left/right), `variant` (sidebar/floating/inset), `collapsible` (offcanvas/icon/none).

**useSidebar()** - Hook for state: `state`, `open`, `setOpen()`, `openMobile`, `setOpenMobile()`, `isMobile`, `toggle()`.

**Sidebar.Header/Footer** - Sticky sections. Example with dropdown menu shown in digest.

**Sidebar.Content** - Scrollable wrapper for groups.

**Sidebar.Group** - Section with label, content, optional action. Can be wrapped in `Collapsible.Root` for collapse.

**Sidebar.MenuButton** - Menu item button. Use `child` snippet for links. Props: `isActive`.

**Sidebar.MenuAction** - Independent action button. Works with `DropdownMenu`.

**Sidebar.MenuSub** - Submenu. Wrap in `Collapsible.Root` for collapse.

**Sidebar.MenuBadge** - Badge display.

**Sidebar.MenuSkeleton** - Loading skeleton.

**Sidebar.Separator** - Divider line.

**Sidebar.Trigger** - Toggle button. Custom trigger via `useSidebar().toggle()`.

**Sidebar.Rail** - Rail for toggling.

### Controlled State
```svelte
<Sidebar.Provider bind:open>
  <Sidebar.Root />
</Sidebar.Provider>
```

### Styling
- Hide in icon mode: `class="group-data-[collapsible=icon]:hidden"`
- Style action on active button: `class="peer-data-[active=true]/menu-button:opacity-100"`