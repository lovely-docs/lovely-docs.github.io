## Setting Classes

**Attribute approach (preferred):**
- Primitive: `class={condition ? 'large' : 'small'}`
- Objects: `class={{ cool, lame: !cool }}`
- Arrays: `class={[faded && 'saturate-0', large && 'scale-200']}`
- Type-safe: `import type { ClassValue } from 'svelte/elements'`

**Directive approach (legacy):**
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
<!-- or shorthand -->
<div class:cool class:lame={!cool}>...</div>
```