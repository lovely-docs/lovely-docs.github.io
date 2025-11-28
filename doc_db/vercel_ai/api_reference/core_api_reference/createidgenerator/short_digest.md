Creates a customizable ID generator with configurable prefix, separator, alphabet, and size.

```ts
const generateUserId = createIdGenerator({
  prefix: 'user',
  separator: '_',
  size: 8,
});
const id = generateUserId(); // "user_1a2b3c4d"
```

Uses non-secure random generation; separator must not be in alphabet.