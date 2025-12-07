**Result<T, E>** - Synchronous success/failure type with methods: `map`, `mapErr`, `andThen`, `orElse`, `match`, `unwrapOr`, `andTee`, `orTee`, `andThrough`. Static: `fromThrowable`, `combine`, `combineWithAllErrors`.

**ResultAsync<T, E>** - Async version with same methods plus `asyncMap`, `asyncAndThen`, `asyncAndThrough`. Static: `fromThrowable`, `fromPromise`, `fromSafePromise`, `combine`, `combineWithAllErrors`.

**Utilities:** `safeTry` for generator-based unwrapping, `fromThrowable`/`fromAsyncThrowable`/`fromPromise`/`fromSafePromise` top-level exports.

**Testing:** `_unsafeUnwrap()` and `_unsafeUnwrapErr()` for test assertions.