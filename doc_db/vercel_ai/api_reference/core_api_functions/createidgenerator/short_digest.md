Creates customizable ID generator with configurable prefix, separator, alphabet, and size.

```ts
import { createIdGenerator } from 'ai';

const generateUserId = createIdGenerator({
  prefix: 'user',
  separator: '_',
  size: 8,
});
const id = generateUserId(); // "user_1a2b3c4d"
```

Options: `alphabet` (default: alphanumeric), `prefix`, `separator` (default: "-"), `size` (default: 16). Non-secure random generation.