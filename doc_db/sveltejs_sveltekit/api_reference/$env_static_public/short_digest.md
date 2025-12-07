Import public environment variables (prefixed with `PUBLIC_` by default) that are statically replaced at build time:

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```