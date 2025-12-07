Converts values to `""` or `undefined` for proper HTML boolean attributes. Truthy values become `""` (attribute present), falsy values become `undefined` (attribute absent).

```ts
import { boolAttr } from "runed";
<div data-active={boolAttr(isActive)}>Content</div>
```