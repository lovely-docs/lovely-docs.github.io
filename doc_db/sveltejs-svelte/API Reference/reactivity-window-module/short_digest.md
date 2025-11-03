Reactive window values via `svelte/reactivity/window` module. Access properties like `innerWidth.current` and `innerHeight.current` in templates and reactive contexts without manual bindings.

```svelte
import { innerWidth, innerHeight } from 'svelte/reactivity/window';
<p>{innerWidth.current}x{innerHeight.current}</p>
```