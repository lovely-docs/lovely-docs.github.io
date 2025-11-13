## Server Rendering Errors
- **await_invalid**: Async work in sync render - await `render()` or wrap in `<svelte:boundary>`
- **html_deprecated**: Use `body` instead of `html` property
- **lifecycle_function_unavailable**: Methods like `mount` unavailable on server - don't call during render