## Resizable

Accessible resizable panel groups with keyboard support, built on PaneForge.

```svelte
<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={50}>Content</Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={50}>Content</Resizable.Pane>
</Resizable.PaneGroup>
```

Key props: `direction` ("horizontal"/"vertical"), `defaultSize` (percentage), `withHandle` (show visual handle). Panels can be nested.