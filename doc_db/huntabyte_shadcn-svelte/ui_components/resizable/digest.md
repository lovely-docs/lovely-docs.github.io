## Resizable

Accessible resizable panel groups and layouts with keyboard support, built on PaneForge.

### Installation

```bash
npx shadcn-svelte@latest add resizable -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

Import and use the Resizable components:

```svelte
<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane>One</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane>Two</Resizable.Pane>
</Resizable.PaneGroup>
```

### Components

- **PaneGroup**: Container for resizable panes with `direction` prop ("horizontal" or "vertical")
- **Pane**: Individual resizable panel with optional `defaultSize` prop (percentage)
- **Handle**: Divider between panes, can show visual indicator with `withHandle` prop

### Vertical Layout

```svelte
<Resizable.PaneGroup direction="vertical" class="min-h-[200px] max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={25}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Header</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={75}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Content</span>
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

### Nested Layouts

Combine horizontal and vertical pane groups:

```svelte
<Resizable.PaneGroup direction="horizontal" class="max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={50}>
    <div class="flex h-[200px] items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={25}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={75}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Three</span>
        </div>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

### Handle Visibility

Use `withHandle` prop on Handle to display a visual indicator:

```svelte
<Resizable.PaneGroup direction="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={25}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Sidebar</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={75}>
    <div class="flex h-full items-center justify-center p-6">
      <span class="font-semibold">Content</span>
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

For all available props and features, see the PaneForge documentation.