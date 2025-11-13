## Portal Component

Renders children to a different DOM location (default: body) to prevent layout issues.

**Props:**
- `to` - Target element or selector (default: `document.body`)
- `disabled` - Disable portal behavior (default: false)
- `children` - Content to render

**Examples:**
```svelte
<Portal to="#custom-target">
  <div>Content</div>
</Portal>

<Portal disabled>
  <div>Not portalled</div>
</Portal>

<BitsConfig defaultPortalTo={target}>
  <Portal><!-- Uses custom default --></Portal>
</BitsConfig>
```