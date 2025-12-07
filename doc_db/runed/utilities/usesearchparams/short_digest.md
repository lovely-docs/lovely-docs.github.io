## useSearchParams

Reactive, type-safe URL search parameter management with schema validation, defaults, compression, debouncing, and history control.

### Basic Usage
```ts
// Define schema
const schema = z.object({
	page: z.coerce.number().default(1),
	filter: z.string().default(""),
	sort: z.enum(["newest", "oldest", "price"]).default("newest")
});

// Use in component
const params = useSearchParams(schema);
params.page = 2; // Updates URL
params.update({ page: 3, sort: 'oldest' });
params.reset();
params.toURLSearchParams();

// Use in load function
const { searchParams } = validateSearchParams(url, schema);
```

### Options
- `showDefaults`, `debounce`, `pushHistory`, `compress`, `compressedParamName`, `updateURL`, `noScroll`, `dateFormats`

### Schema Validators
Supports Zod, Valibot, Arktype, or built-in `createSearchParamsSchema` (lightweight, no dependencies)

### Date Formats
- `dateFormat: "date"` → YYYY-MM-DD (e.g., 2025-10-21)
- `dateFormat: "datetime"` → ISO8601 (e.g., 2025-10-21T18:18:14.196Z)

### Zod Codecs (v4.1.0+)
Custom bidirectional transformations for URL serialization:
```ts
const unixTimestamp = z.codec(z.coerce.number(), z.date(), {
	decode: (ts) => new Date(ts * 1000),
	encode: (date) => Math.floor(date.getTime() / 1000)
});

const schema = z.object({
	createdAfter: unixTimestamp.optional()
});
```

### Reactivity
Top-level only: `params.page = 2` ✅, `params.config.theme = 'dark'` ❌ (use `params.config = {...params.config, theme: 'dark'}` instead)