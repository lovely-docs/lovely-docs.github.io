## Separator

Headless component for visually separating content.

```svelte
import { Separator } from "bits-ui";

// Horizontal (default)
<Separator.Root class="h-px w-full bg-border" />

// Vertical
<Separator.Root orientation="vertical" class="h-full w-[1px] bg-border" />
```

**Props:** `orientation` ('horizontal'|'vertical', default 'horizontal'), `decorative` (boolean, default false), `ref` (bindable HTMLDivElement), `children`/`child` (Snippet)

**Data attributes:** `data-orientation`, `data-separator-root`