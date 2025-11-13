## Resizable

Accessible resizable panel groups and layouts with keyboard support, built on PaneForge.

### Installation

```bash
npm install shadcn-svelte@latest add resizable
```

### Usage

Import and use resizable panels with `PaneGroup`, `Pane`, and `Handle` components:

```svelte
<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<Resizable.PaneGroup direction="horizontal">
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

### Key Props

- `direction`: Set to `"horizontal"` or `"vertical"` on `PaneGroup`
- `defaultSize`: Set initial pane size (percentage) on `Pane`
- `withHandle`: Show visual handle on `Handle` component for better UX

Panels can be nested for complex layouts. See PaneForge documentation for all available props.