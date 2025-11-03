## Class Binding

**Attribute form (Svelte 5.16+):**
- Objects: `class={{ cool, lame: !cool }}`
- Arrays: `class={[faded && 'saturate-0', large && 'scale-200']}`
- Nested arrays/objects flatten for composability
- Type-safe with `ClassValue` type

**Directive form (legacy):**
- `class:cool={cool}` or shorthand `class:cool`
- Prefer the attribute form in modern Svelte