## Resizable

Accessible resizable panel groups with keyboard support, built on PaneForge.

### Installation

```bash
npx shadcn-svelte@latest add resizable -y -o
```

### Basic Usage

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

### Key Props

- **PaneGroup**: `direction` ("horizontal" or "vertical")
- **Pane**: `defaultSize` (percentage)
- **Handle**: `withHandle` (show visual indicator)

### Examples

**Vertical layout:**
```svelte
<Resizable.PaneGroup direction="vertical">
  <Resizable.Pane defaultSize={25}>Header</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={75}>Content</Resizable.Pane>
</Resizable.PaneGroup>
```

**Nested layouts:**
```svelte
<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={50}>One</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={25}>Two</Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={75}>Three</Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

**Handle with visual indicator:**
```svelte
<Resizable.Handle withHandle />
```