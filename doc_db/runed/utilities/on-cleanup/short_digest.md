Register a cleanup function called on effect context disposal (component destruction or root effect disposal). Shorthand for returning a cleanup function from `$effect()`.

```ts
import { onCleanup } from "runed";

onCleanup(() => { /* cleanup */ });

$effect.root(() => {
	onCleanup(() => { /* cleanup */ });
});
```