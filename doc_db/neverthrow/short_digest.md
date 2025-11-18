## Result (Synchronous)
- `ok(value)`, `err(error)`: create Ok/Err
- `isOk()`, `isErr()`: check variant
- `map(fn)`, `mapErr(fn)`: transform values
- `unwrapOr(default)`: extract or default
- `andThen(fn)`: chain Results
- `orElse(fn)`: error recovery
- `match(okFn, errFn)`: pattern match and unwrap
- `asyncMap(fn)`: async transformation
- `andTee(fn)`, `orTee(fn)`: side effects without affecting chain
- `andThrough(fn)`: side effects that can fail
- `Result.fromThrowable(fn, errorFn)`: wrap throwing functions
- `Result.combine(list)`: merge Results, short-circuit on error
- `Result.combineWithAllErrors(list)`: merge Results, collect all errors

## ResultAsync (Asynchronous)
- `okAsync(value)`, `errAsync(error)`: create async Ok/Err
- `map(fn)`, `mapErr(fn)`: transform (fn can be async)
- `unwrapOr(default)`: extract or default (returns Promise)
- `andThen(fn)`: chain Results/ResultAsync
- `orElse(fn)`: error recovery
- `match(okFn, errFn)`: pattern match (returns Promise)
- `andTee(fn)`, `orTee(fn)`, `andThrough(fn)`: side effects
- `ResultAsync.fromThrowable(fn, errorFn)`: wrap async throwing functions
- `ResultAsync.fromPromise(promise, errorFn)`: convert Promise
- `ResultAsync.fromSafePromise(promise)`: convert non-rejecting Promise
- `ResultAsync.combine(list)`, `combineWithAllErrors(list)`: merge ResultAsync

## Utilities
- `fromThrowable`, `fromAsyncThrowable`, `fromPromise`, `fromSafePromise`: top-level exports
- `safeTry(generatorFn)`: reduce boilerplate with generator-based error handling

## Testing
- `_unsafeUnwrap()`, `_unsafeUnwrapErr()`: extract values (test only)
- Results are comparable: `expect(result).toEqual(ok(value))`