## Breaking Changes: Postgres Timestamp Handling

The `postgres.js` driver instance has been modified to always return strings for dates. Drizzle then maps these to either strings or Date objects based on the selected `mode`. This is a breaking change that affects how timestamps are handled.

**Key Impact:**
- Timestamps with and without timezone now always use `.toISOString()` for mapping to the driver
- All `postgres.js` clients passed to Drizzle will have mutated behavior - dates will always be strings in responses
- If you were expecting specific timestamp responses, behavior has changed

**Parser Override for postgres.js:**
```ts
const transparentParser = (val: any) => val;

// Override postgres.js default date parsers
for (const type of ['1184', '1082', '1083', '1114']) {
	client.options.parsers[type as any] = transparentParser;
	client.options.serializers[type as any] = transparentParser;
}
```

The team notes this is not ideal since the driver client gets mutated. They're working with the `postgres.js` library creator to enable per-query mapping interceptors instead.

## Fixes

Multiple timestamp and date-related issues resolved:
- Timestamp with mode string returning Date object instead of string
- Inconsistent date/datetime handling across drivers
- Type mismatches (columns showing string type but returning Date objects)
- PostgreSQL timezone-related conversion issues
- Millisecond loss during timestamp inserts
- Invalid dates from relational queries