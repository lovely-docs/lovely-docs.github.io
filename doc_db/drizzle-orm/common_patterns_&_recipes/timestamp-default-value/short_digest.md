## Timestamp Default Values

**PostgreSQL**: Use `defaultNow()` or `sql`now()`` for current timestamp, `sql`extract(epoch from now())`` for unix seconds.

**MySQL**: Use `defaultNow()` or `sql`now()`` with optional `fsp` for fractional seconds, `sql`unix_timestamp()`` for unix seconds.

**SQLite**: Use `sql`current_timestamp`` for text timestamp, `sql`unixepoch()`` or `sql`unixepoch() * 1000`` for unix seconds/milliseconds.

Mode options: `string` (text), `timestamp`/`timestamp_ms` (Date objects), `number` (raw value).