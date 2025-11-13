## applyAction
Updates `form` property and `page.status`, redirects to error page on error.

## deserialize
Converts form submission response text to ActionResult.

## enhance
Enhances `<form>` to work without JavaScript. Intercepts submission with `submit` callback, supports `cancel()` and `controller` to abort. Default behavior updates form, resets on success, redirects on redirect/error. Custom callback can invoke `update({ reset: false, invalidateAll: false })` for default behavior with options.