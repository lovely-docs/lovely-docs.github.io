## await_invalid
Encountered asynchronous work while rendering synchronously. This occurs when `render(...)` is called with a component containing an `await` expression. Solutions:
- Await the result of `render`
- Wrap the `await` or component in a `<svelte:boundary>` with a `pending` snippet

## html_deprecated
The `html` property of server render results is deprecated. Use `body` instead.

## lifecycle_function_unavailable
`%name%(...)` is not available on the server. Methods like `mount` cannot be invoked in server context. Avoid calling them eagerly during render.