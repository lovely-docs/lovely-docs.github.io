## IsMounted

Tracks component mount state via `isMounted.current` property.

```svelte
import { IsMounted } from "runed";
const isMounted = new IsMounted();
// isMounted.current is false initially, true after mount
```

Equivalent to using `onMount` or `$effect` with `untrack` to set a state value.