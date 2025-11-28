## createIdGenerator()

Creates a customizable ID generator function with configurable alphabet, prefix, separator, and size.

### Import
```ts
import { createIdGenerator } from 'ai';
```

### Parameters (options object)
- `alphabet` (string): Characters for the random part. Defaults to alphanumeric (0-9, A-Z, a-z).
- `prefix` (string): String prepended to all IDs. Defaults to none.
- `separator` (string): Character(s) between prefix and random part. Defaults to "-".
- `size` (number): Length of the random part. Defaults to 16.

### Returns
A function that generates IDs based on the configured options.

### Usage Example
```ts
const generateUserId = createIdGenerator({
  prefix: 'user',
  separator: '_',
  size: 8,
});

const id = generateUserId(); // e.g., "user_1a2b3c4d"
```

### Important Notes
- Uses non-secure random generation; not suitable for security-critical purposes.
- The separator character must not be part of the alphabet to ensure reliable prefix checking.