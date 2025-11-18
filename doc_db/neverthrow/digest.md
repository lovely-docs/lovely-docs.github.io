## Overview
NeverThrow provides a `Result` type representing either success (`Ok`) or failure (`Err`), plus `ResultAsync` for asynchronous operations wrapping `Promise<Result<T, E>>`. Both are thenable and provide chainable methods without requiring `await` or `.then()`.

## Installation
```sh
npm install neverthrow
```

## Top-Level Exports
- `ok`, `err`: convenience functions to create Ok/Err variants
- `Ok`, `Err`: classes and types
- `Result`: type and namespace for static methods
- `okAsync`, `errAsync`: async variants
- `ResultAsync`: async class
- `fromThrowable`, `fromAsyncThrowable`, `fromPromise`, `fromSafePromise`, `safeTry`: utility functions

## Synchronous API (Result)

**`ok(value: T): Ok<T, E>`** - Creates Ok variant
```typescript
const myResult = ok({ myData: 'test' })
myResult.isOk() // true
```

**`err(error: E): Err<T, E>`** - Creates Err variant
```typescript
const myResult = err('Oh noooo')
myResult.isErr() // true
```

**`isOk(): boolean`** - Returns true if Ok variant

**`isErr(): boolean`** - Returns true if Err variant

**`map<U>(callback: (value: T) => U): Result<U, E>`** - Transforms Ok value, leaves Err untouched
```typescript
ok(2).map(n => n ** 2) // Ok(4)
err(3).map(n => n ** 2) // Err(3)
```

**`mapErr<F>(callback: (error: E) => F): Result<T, F>`** - Transforms Err value, leaves Ok untouched
```typescript
err('error').mapErr(e => `Error: ${e}`) // Err('Error: error')
```

**`unwrapOr<T>(value: T): T`** - Returns Ok value or default
```typescript
err('Oh noooo').unwrapOr(10) // 10
ok(5).unwrapOr(10) // 5
```

**`andThen<U, F>(callback: (value: T) => Result<U, F>): Result<U, E | F>`** - Chains Results, flattens nested Results
```typescript
ok(2).andThen(n => ok(n ** 2)).andThen(n => ok(n + 1)) // Ok(5)
ok(2).andThen(n => err('failed')) // Err('failed')
```

**`asyncAndThen<U, F>(callback: (value: T) => ResultAsync<U, F>): ResultAsync<U, E | F>`** - Chains with async Results

**`orElse<U, A>(callback: (error: E) => Result<U, A>): Result<U | T, A>`** - Error recovery
```typescript
err('NotFound').orElse(e => ok('default')) // Ok('default')
```

**`match<A, B>(okCallback: (value: T) => A, errorCallback: (error: E) => B): A | B`** - Pattern matching, unwraps Result
```typescript
ok(5).match(v => v * 2, e => 0) // 10
err('fail').match(v => v * 2, e => 0) // 0
```

**`asyncMap<U>(callback: (value: T) => Promise<U>): ResultAsync<U, E>`** - Maps with async function, returns ResultAsync
```typescript
ok(5).asyncMap(async n => n * 2) // ResultAsync<number, E>
```

**`andTee(callback: (value: T) => unknown): Result<T, E>`** - Side effects on Ok, passes through original
```typescript
ok(5).andTee(console.log).map(n => n * 2) // logs 5, returns Ok(10)
```

**`orTee(callback: (error: E) => unknown): Result<T, E>`** - Side effects on Err, passes through original

**`andThrough<F>(callback: (value: T) => Result<unknown, F>): Result<T, E | F>`** - Like andTee but propagates errors
```typescript
ok(5).andThrough(validate).andThen(process) // errors from validate propagate
```

**`asyncAndThrough<F>(callback: (value: T) => ResultAsync<unknown, F>): ResultAsync<T, E | F>`** - Async version of andThrough

**`Result.fromThrowable(fn, errorFn?): (...args) => Result`** - Wraps throwing function to return Result
```typescript
const safeJsonParse = Result.fromThrowable(JSON.parse, () => new Error('Parse error'))
safeJsonParse("{") // Err(Error('Parse error'))
```

**`Result.combine(resultList: Result<T, E>[]): Result<T[], E>`** - Combines array of Results, short-circuits on first Err
```typescript
Result.combine([ok(1), ok(2)]) // Ok([1, 2])
Result.combine([ok(1), err('fail')]) // Err('fail')
```

**`Result.combineWithAllErrors(resultList: Result<T, E>[]): Result<T[], E[]>`** - Combines all Results, collects all errors
```typescript
Result.combineWithAllErrors([ok(1), err('a'), ok(2), err('b')]) // Err(['a', 'b'])
```

## Asynchronous API (ResultAsync)

**`okAsync(value: T): ResultAsync<T, E>`** - Creates async Ok
```typescript
const res = okAsync(5)
const result = await res // Ok(5)
```

**`errAsync(error: E): ResultAsync<T, E>`** - Creates async Err

**`ResultAsync.fromThrowable(fn, errorFn): (...args) => ResultAsync`** - Wraps async throwing function
```typescript
const insertUser = ResultAsync.fromThrowable(db.insert, () => new Error('DB error'))
```

**`ResultAsync.fromPromise(promise, errorHandler): ResultAsync<T, E>`** - Converts Promise to ResultAsync
```typescript
ResultAsync.fromPromise(fetch(url), () => new Error('Network error'))
```

**`ResultAsync.fromSafePromise(promise): ResultAsync<T, E>`** - Converts Promise that won't reject
```typescript
ResultAsync.fromSafePromise(new Promise(resolve => setTimeout(() => resolve(5), 1000)))
```

**`map<U>(callback: (value: T) => U | Promise<U>): ResultAsync<U, E>`** - Maps Ok value (sync or async)
```typescript
okAsync(5).map(n => n * 2) // ResultAsync<number, E>
okAsync(5).map(async n => await fetchData(n)) // ResultAsync<Data, E>
```

**`mapErr<F>(callback: (error: E) => F | Promise<F>): ResultAsync<T, F>`** - Maps Err value

**`unwrapOr(value: T): Promise<T>`** - Returns Ok value or default as Promise
```typescript
await errAsync(0).unwrapOr(10) // 10
```

**`andThen<U, F>(callback: (value: T) => Result<U, F> | ResultAsync<U, F>): ResultAsync<U, E | F>`** - Chains Results/ResultAsync
```typescript
okAsync(2).andThen(n => ok(n ** 2)).andThen(n => okAsync(n + 1)) // ResultAsync<number, E>
```

**`orElse<U, A>(callback: (error: E) => Result<U, A> | ResultAsync<U, A>): ResultAsync<U | T, A>`** - Error recovery

**`match<A, B>(okCallback: (value: T) => A, errorCallback: (error: E) => B): Promise<A | B>`** - Pattern matching, returns Promise
```typescript
await okAsync(5).match(v => v * 2, e => 0) // 10
```

**`andTee(callback: (value: T) => unknown): ResultAsync<T, E>`** - Side effects on Ok, passes through

**`orTee(callback: (error: E) => unknown): ResultAsync<T, E>`** - Side effects on Err, passes through

**`andThrough<F>(callback: (value: T) => Result<unknown, F> | ResultAsync<unknown, F>): ResultAsync<T, E | F>`** - Like andTee but propagates errors

**`ResultAsync.combine(resultList: ResultAsync<T, E>[]): ResultAsync<T[], E>`** - Combines array of ResultAsync

**`ResultAsync.combineWithAllErrors(resultList: ResultAsync<T, E>[]): ResultAsync<T[], E[]>`** - Combines all ResultAsync, collects errors

## Utilities

**`fromThrowable`** - Top-level export of Result.fromThrowable

**`fromAsyncThrowable`** - Top-level export of ResultAsync.fromThrowable

**`fromPromise`** - Top-level export of ResultAsync.fromPromise

**`fromSafePromise`** - Top-level export of ResultAsync.fromSafePromise

**`safeTry(generatorFn): Result | Promise<Result>`** - Reduces boilerplate for chaining Results using generator functions
```typescript
function myFunc(): Result<number, string> {
  return safeTry(function*() {
    const val1 = yield* mayFail1().mapErr(e => `error 1: ${e}`)
    const val2 = yield* mayFail2().mapErr(e => `error 2: ${e}`)
    return ok(val1 + val2)
  })
}
// If either mayFail1 or mayFail2 returns Err, safeTry returns that Err immediately
```

## Testing

**`_unsafeUnwrap(): T`** - Unwraps Ok value or throws (test only)
```typescript
expect(myResult._unsafeUnwrap()).toBe(5)
```

**`_unsafeUnwrapErr(): E`** - Unwraps Err value or throws (test only)
```typescript
expect(myResult._unsafeUnwrapErr()).toBe('error')
```

**Stack traces** - Pass config to enable:
```typescript
_unsafeUnwrap({ withStackTrace: true })
```

**Comparison** - Results are comparable, no unwrap needed:
```typescript
expect(myResult).toEqual(ok(5))
```

## ESLint Plugin

Install `eslint-plugin-neverthrow` to enforce error handling. Requires consuming Result via `.match()`, `.unwrapOr()`, or `._unsafeUnwrap()`.

## Philosophy

NeverThrow encourages explicit error handling over throwing/catching, making error paths visible and reasoning about programs easier. Errors are encoded into the type system rather than relying on caller knowledge of thrown exceptions.