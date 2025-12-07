## Portal Component

Renders children to a different DOM location (default: `body`).

**Props:**
- `to` (Element | string): Target element/selector for portal
- `disabled` (boolean): Disable portal behavior to render inline
- `children` (Snippet): Content to render

**Examples:**
```svelte
<Portal>Content to body</Portal>
<Portal to="#custom-target">Content to target</Portal>
<Portal disabled>Content inline</Portal>
<BitsConfig defaultPortalTo={target}><Portal>Uses custom default</Portal></BitsConfig>
```