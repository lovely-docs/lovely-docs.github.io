## Improvements

LibSQL migrations now use batch execution instead of transactions. Batch operations execute multiple SQL statements sequentially within an implicit transaction - the backend commits all changes on success or rolls back completely on any failure.

## Fixes

- Fixed findFirst query for bun:sqlite