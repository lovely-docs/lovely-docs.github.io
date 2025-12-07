## Overview
NeverThrow provides `Result<T, E>` and `ResultAsync<T, E>` types for encoding success/failure into programs without throwing exceptions.

## Synchronous API (Result)

**Constructors:**
- `ok<T, E>(value: T): Ok<T, E>` - Create success variant
- `err<T, E>(error: E): Err<T, E>` - Create failure variant

**Inspection:**
- `isOk(): boolean` - Check if Ok variant
- `isErr(): boolean` - Check if Err variant

**Transformation:**
- `map<U>(callback: (value: T) => U): Result<U, E>` - Transform Ok value
  ```typescript
  ok(2).map(x => x * 2) // Ok(4)
  err('fail').map(x => x * 2) // Err('fail')
  ```
- `mapErr<F>(callback: (error: E) => F): Result<T, F>` - Transform Err value
  ```typescript
  err('fail').mapErr(e => `Error: ${e}`) // Err('Error: fail')
  ```
- `andThen<U, F>(callback: (value: T) => Result<U, F>): Result<U, E | F>` - Chain Results, flattens nesting
  ```typescript
  ok(2).andThen(x => ok(x ** 2)).andThen(x => ok(x ** 2)) // Ok(16)
  ok(2).andThen(x => err('fail')) // Err('fail')
  ok(ok(1234)).andThen(inner => inner) // Ok(1234)
  ```
- `asyncAndThen<U, F>(callback: (value: T) => ResultAsync<U, F>): ResultAsync<U, E | F>` - Chain with async Results
- `orElse<U, A>(callback: (error: E) => Result<U, A>): Result<U | T, A>` - Error recovery
  ```typescript
  err(NotFound).orElse(e => e === NotFound ? ok('default') : err(500))
  ```
- `asyncMap<U>(callback: (value: T) => Promise<U>): ResultAsync<U, E>` - Map with async function
- `andTee(callback: (value: T) => unknown): Result<T, E>` - Side effect on Ok, pass through unchanged
- `orTee(callback: (error: E) => unknown): Result<T, E>` - Side effect on Err, pass through unchanged
- `andThrough<F>(callback: (value: T) => Result<unknown, F>): Result<T, E | F>` - Side effect that can fail
- `asyncAndThrough<F>(callback: (value: T) => ResultAsync<unknown, F>): ResultAsync<T, E | F>` - Async side effect that can fail

**Unwrapping:**
- `unwrapOr<T>(value: T): T` - Get Ok value or default
  ```typescript
  err('fail').map(x => x * 2).unwrapOr(10) // 10
  ```
- `match<A, B>(okCallback: (value: T) => A, errorCallback: (error: E) => B): A | B` - Pattern match both variants
  ```typescript
  result.match(
    str => str.toUpperCase(),
    err => `Error: ${err}`
  )
  ```

**Static Methods:**
- `Result.fromThrowable(fn, errorFn): (args) => Result` - Wrap throwable function
  ```typescript
  const safeJsonParse = Result.fromThrowable(JSON.parse, () => new Error('Parse error'))
  safeJsonParse("{") // Err(Error)
  ```
- `Result.combine<T, E>(resultList: Result<T, E>[]): Result<T[], E>` - Combine list of Results, short-circuits on first Err
  ```typescript
  Result.combine([ok(1), ok(2)]) // Ok([1, 2])
  Result.combine([ok(1), err('fail'), ok(2)]) // Err('fail')
  ```
- `Result.combineWithAllErrors<T, E>(resultList: Result<T, E>[]): Result<T[], E[]>` - Combine all Results, collects all Errs
  ```typescript
  Result.combineWithAllErrors([ok(1), err('a'), ok(2), err('b')]) // Err(['a', 'b'])
  ```

**Testing:**
- `_unsafeUnwrap(config?: {withStackTrace?: boolean}): T` - Unwrap Ok or throw (test only)
- `_unsafeUnwrapErr(config?: {withStackTrace?: boolean}): E` - Unwrap Err or throw (test only)

## Asynchronous API (ResultAsync)

**Constructors:**
- `okAsync<T, E>(value: T): ResultAsync<T, E>` - Create async success
- `errAsync<T, E>(error: E): ResultAsync<T, E>` - Create async failure

**Static Methods:**
- `ResultAsync.fromThrowable(fn, errorFn): (args) => ResultAsync` - Wrap async throwable function (safer than fromPromise for non-async functions)
- `ResultAsync.fromPromise<T, E>(promise: PromiseLike<T>, errorHandler: (unknown) => E): ResultAsync<T, E>` - Wrap Promise that may reject
  ```typescript
  ResultAsync.fromPromise(insertIntoDb(user), () => new Error('DB error'))
  ```
- `ResultAsync.fromSafePromise<T, E>(promise: PromiseLike<T>): ResultAsync<T, E>` - Wrap Promise that won't reject
  ```typescript
  ResultAsync.fromSafePromise(new Promise(resolve => setTimeout(() => resolve(value), 3000)))
  ```
- `ResultAsync.combine<T, E>(resultList: ResultAsync<T, E>[]): ResultAsync<T[], E>` - Combine async Results
- `ResultAsync.combineWithAllErrors<T, E>(resultList: ResultAsync<T, E>[]): ResultAsync<T[], E[]>` - Combine collecting all errors

**Methods:** (same as Result but return ResultAsync and accept async callbacks)
- `map<U>(callback: (value: T) => U | Promise<U>): ResultAsync<U, E>`
- `mapErr<F>(callback: (error: E) => F | Promise<F>): ResultAsync<T, F>`
- `andThen<U, F>(callback: (value: T) => Result<U, F> | ResultAsync<U, F>): ResultAsync<U, E | F>`
- `orElse<U, A>(callback: (error: E) => Result<U, A> | ResultAsync<U, A>): ResultAsync<U | T, A>`
- `unwrapOr<T>(value: T): Promise<T>`
- `match<A, B>(okCallback: (value: T) => A, errorCallback: (error: E) => B): Promise<A | B>`
- `andTee(callback: (value: T) => unknown): ResultAsync<T, E>`
- `orTee(callback: (error: E) => unknown): ResultAsync<T, E>`
- `andThrough<F>(callback: (value: T) => Result<unknown, F> | ResultAsync<unknown, F>): ResultAsync<T, E | F>`

## Utilities

- `fromThrowable` - Top-level export of Result.fromThrowable
- `fromAsyncThrowable` - Top-level export of ResultAsync.fromThrowable
- `fromPromise` - Top-level export of ResultAsync.fromPromise
- `fromSafePromise` - Top-level export of ResultAsync.fromSafePromise
- `safeTry<T, E>(generatorFn: function*): Result<T, E>` - Use generator syntax to unwrap Results inline
  ```typescript
  function myFunc(): Result<number, string> {
    return safeTry(function*() {
      const val1 = yield* mayFail1().mapErr(e => `error 1: ${e}`)
      const val2 = yield* mayFail2().mapErr(e => `error 2: ${e}`)
      return ok(val1 + val2)
    })
  }
  ```
  Also supports async generators for async Results.

## ESLint Plugin

`eslint-plugin-neverthrow` enforces that Results are consumed via `.match()`, `.unwrapOr()`, or `._unsafeUnwrap()`, similar to Rust's `#[must_use]` attribute.