Utility component that tracks active keyboard usage via global shared state. Access current state with `isUsingKeyboard.current`.

```svelte
import { IsUsingKeyboard } from "bits-ui";
const isUsingKeyboard = new IsUsingKeyboard();
const shouldShowMenu = $derived(isUsingKeyboard.current);
```