## Separator

Headless component for separating content.

```svelte
import { Separator } from "bits-ui";

<!-- Horizontal (default) -->
<Separator.Root class="h-px w-full" />

<!-- Vertical -->
<Separator.Root orientation="vertical" class="w-[1px] h-full" />
```

**Props**: `orientation` ('horizontal' | 'vertical'), `decorative` (boolean), `ref` (bindable HTMLDivElement)

**Data Attributes**: `data-orientation`, `data-separator-root`