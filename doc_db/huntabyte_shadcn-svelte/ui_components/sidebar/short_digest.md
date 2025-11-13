## Installation

`pnpm dlx shadcn-svelte@latest add sidebar` + add CSS variables for theming.

## Basic Setup

```svelte
<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header />
    <Sidebar.Content>
      <Sidebar.Group />
    </Sidebar.Content>
    <Sidebar.Footer />
  </Sidebar.Root>
  <main>
    <Sidebar.Trigger />
  </main>
</Sidebar.Provider>
```

## Menu Example

```svelte
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
```

## Key Props

**Sidebar.Root**: `side` ("left"/"right"), `variant` ("sidebar"/"floating"/"inset"), `collapsible` ("offcanvas"/"icon"/"none")

**Sidebar.Provider**: `open` (bindable boolean), `onOpenChange` callback. Set width with `--sidebar-width` CSS variable.

## useSidebar Hook

```svelte
const sidebar = useSidebar();
sidebar.state; // "expanded" or "collapsed"
sidebar.open; // boolean
sidebar.toggle(); // toggle sidebar
sidebar.isMobile; // boolean
```

## Components

`Sidebar.Header/Footer` (sticky), `Sidebar.Content` (scrollable), `Sidebar.Group` (sections, can be collapsible), `Sidebar.Menu/MenuItem/MenuButton/MenuAction/MenuSub`, `Sidebar.MenuBadge`, `Sidebar.MenuSkeleton`, `Sidebar.Separator`, `Sidebar.Trigger`, `Sidebar.Rail`

## Custom Trigger

```svelte
<button onclick={() => useSidebar().toggle()}>Toggle</button>
```

## Controlled State

```svelte
<Sidebar.Provider bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
```