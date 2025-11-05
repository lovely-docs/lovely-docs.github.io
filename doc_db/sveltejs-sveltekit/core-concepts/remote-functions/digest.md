Remote functions enable type-safe client-server communication. They're exported from `.remote.js` or `.remote.ts` files and always run on the server, allowing safe access to server-only modules like databases and environment variables.

**Setup**: Enable in `svelte.config.js`:
```js
kit: { experimental: { remoteFunctions: true } },
compilerOptions: { experimental: { async: true } }
```

**query**: Read dynamic data from server. Accepts optional validation schema and returns a Promise with `loading`, `error`, `current` properties, or use with `await`. Supports `refresh()` to re-fetch and caching while on page.

```js
export const getPost = query(v.string(), async (slug) => {
  const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
  if (!post) error(404, 'Not found');
  return post;
});
```

**query.batch**: Batches simultaneous queries into single request. Server callback receives array of arguments and returns function `(input, index) => output`.

```js
export const getWeather = query.batch(v.string(), async (cities) => {
  const weather = await db.sql`SELECT * FROM weather WHERE city = ANY(${cities})`;
  const lookup = new Map(weather.map(w => [w.city, w]));
  return (city) => lookup.get(city);
});
```

**form**: Write data via HTML form. Takes validation schema and handler. Returns object with `method`, `action` for progressive enhancement, and `fields` for building inputs.

```js
export const createPost = form(
  v.object({ title: v.pipe(v.string(), v.nonEmpty()), content: v.pipe(v.string(), v.nonEmpty()) }),
  async ({ title, content }) => {
    const user = await auth.getUser();
    if (!user) error(401, 'Unauthorized');
    await db.sql`INSERT INTO post (slug, title, content) VALUES (${slug}, ${title}, ${content})`;
    redirect(303, `/blog/${slug}`);
  }
);
```

Field attributes via `.as(type)`: `input {...field.as('text')}`, `textarea {...field.as('text')}`, `input {...field.as('checkbox')}`, `input {...field.as('radio', value)}`, `select {...field.as('select')}`.

Validation: Call `validate()` programmatically. Use `preflight(schema)` for client-side validation. Access issues via `field.issues()` or `fields.allIssues()`. Programmatically mark invalid with `invalid(issue1, issue2)` or `invalid.fieldName(message)`.

Get/set values: `field.value()` returns current value, `fields.value()` returns object. Update with `fields.set({...})` or `field.set(value)`.

Sensitive data: Prefix field name with underscore to prevent repopulation on validation failure: `_password`.

Single-flight mutations: Refresh queries after form submission via `await getPosts().refresh()` or `await getPost(id).set(result)` inside handler, or client-side with `submit().updates(getPosts())` and `withOverride((posts) => [...])`.

Returns: Handler can return data available as `form.result` or use `redirect()`. Result is ephemeral.

Enhance: Customize submission with `form.enhance(async ({ form, data, submit }) => {...})`. Must call `form.reset()` manually.

Multiple instances: Use `form.for(id)` for isolated form instances in lists.

Button props: Use `buttonProps` for different form actions per button via `formaction` attribute.

**command**: Call data-writing function from anywhere (not form-specific). Like `form` but no progressive enhancement. Cannot be called during render. Update queries via `command(id).updates(query(id))` or inside command with `query(id).refresh()`.

**prerender**: Invoke at build time for static data. Specify inputs via `inputs: () => [...]`. Set `dynamic: true` to allow runtime calls with non-prerendered arguments. Data cached via Cache API.

**Validation**: Arguments validated with Standard Schema (Zod, Valibot). Failed validation returns 400 Bad Request. Implement `handleValidationError` hook to customize error. Pass `'unchecked'` to skip validation.

**getRequestEvent**: Access current RequestEvent inside remote functions for cookies/auth. Note: `route`, `params`, `url` relate to calling page, not endpoint. Cannot set headers (except cookies in form/command).

**Redirects**: Supported in `query`, `form`, `prerender`. Not in `command`.