## Remote Functions

Type-safe client-server communication tool. Functions are called from anywhere but always execute on the server, enabling safe access to server-only modules (environment variables, database clients). Requires opt-in via `kit.experimental.remoteFunctions: true` in `svelte.config.js`.

### Overview

Remote functions are exported from `.remote.js` or `.remote.ts` files. On the client, they're transformed to `fetch` wrappers that invoke server counterparts via generated HTTP endpoints. Four types: `query`, `form`, `command`, `prerender`.

### query

Reads dynamic data from server. Returns a Promise that resolves to the result.

```js
// src/routes/blog/data.remote.js
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
	const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
	return posts;
});
```

```svelte
<script>
	import { getPosts } from './data.remote';
</script>

<h1>Recent posts</h1>
{#each await getPosts() as { title, slug }}
	<li><a href="/blog/{slug}">{title}</a></li>
{/each}
```

Alternative to `await`: use `query.loading`, `query.error`, `query.current` properties.

**Query arguments**: Accept single argument, validate with Standard Schema (Zod, Valibot):

```js
import * as v from 'valibot';
import { query } from '$app/server';

export const getPost = query(v.string(), async (slug) => {
	const [post] = await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
	if (!post) error(404, 'Not found');
	return post;
});
```

**Refreshing**: Call `getPosts().refresh()` to re-fetch latest value. Queries are cached per page (`getPosts() === getPosts()`).

**query.batch**: Batches requests within same macrotask to solve n+1 problem. Server callback receives array of arguments, must return function `(input, index) => output`:

```js
export const getWeather = query.batch(v.string(), async (cities) => {
	const weather = await db.sql`SELECT * FROM weather WHERE city = ANY(${cities})`;
	const lookup = new Map(weather.map(w => [w.city, w]));
	return (city) => lookup.get(city);
});
```

### form

Writes data to server. Takes callback receiving `data` from submitted FormData. Returns object with `method` and `action` properties for progressive enhancement.

```js
import * as v from 'valibot';
import { form } from '$app/server';

export const createPost = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		content: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ title, content }) => {
		const user = await auth.getUser();
		if (!user) error(401, 'Unauthorized');
		const slug = title.toLowerCase().replace(/ /g, '-');
		await db.sql`INSERT INTO post (slug, title, content) VALUES (${slug}, ${title}, ${content})`;
		redirect(303, `/blog/${slug}`);
	}
);
```

```svelte
<script>
	import { createPost } from '../data.remote';
</script>

<form {...createPost}>
	<input {...createPost.fields.title.as('text')} />
	<textarea {...createPost.fields.content.as('text')}></textarea>
	<button>Publish!</button>
</form>
```

**Fields**: Call `.as(inputType)` on field to get attributes. Supports nested objects/arrays, strings, numbers, booleans, Files. For checkboxes/radios with same field, pass value as second argument: `.as('radio', 'windows')`. Unchecked checkboxes not included in FormData, so must be optional in schema.

**Programmatic validation**: Use `invalid` function inside handler to mark fields invalid for cases unknown until runtime:

```js
export const buyHotcakes = form(
	v.object({ qty: v.pipe(v.number(), v.minValue(1)) }),
	async (data, invalid) => {
		try {
			await db.buy(data.qty);
		} catch (e) {
			if (e.code === 'OUT_OF_STOCK') {
				invalid(invalid.qty(`we don't have enough hotcakes`));
			}
		}
	}
);
```

**Validation**: Invalid fields show `issues()` array and `aria-invalid="true"`. Call `validate()` programmatically. Use `preflight(schema)` for client-side validation before sending to server. Get all issues with `fields.allIssues()`.

**Getting/setting inputs**: `field.value()` returns current value, auto-updated as user interacts. `fields.value()` returns object of all values. Use `set(...)` to update: `createPost.fields.set({ title: '...', content: '...' })`.

**Sensitive data**: Prefix field name with underscore to prevent sending back on invalid submission: `register.fields._password.as('password')`.

**Single-flight mutations**: By default all queries refresh after successful form submission. Specify which queries to refresh:
- Server-side: `await getPosts().refresh()` or `await getPost(id).set(result)` inside form handler
- Client-side: `await submit().updates(getPosts())` or with override: `await submit().updates(getPosts().withOverride(posts => [newPost, ...posts]))`

**Returns and redirects**: Form handler can `redirect(...)` or `return data`. Returned data available as `createPost.result` (ephemeral).

**enhance**: Customize submission with `enhance(async ({ form, data, submit }) => {...})`. Must call `form.reset()` manually. Use `submit().updates(...)` for single-flight mutations.

**Multiple instances**: Use `modifyTodo.for(id)` to create isolated form instances for repeated forms.

**buttonProps**: Different buttons can submit to different URLs via `formaction`. Use `register.buttonProps` on button to submit to different form.

### command

Writes data without being tied to form element. Can be called from anywhere (not during render). Like `form`, accepts optional validated argument.

```js
import * as v from 'valibot';
import { command } from '$app/server';

export const addLike = command(v.string(), async (id) => {
	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
});
```

```svelte
<button onclick={async () => {
	try {
		await addLike(item.id);
	} catch (error) {
		showToast('Something went wrong!');
	}
}}>
	add like
</button>
```

**Updating queries**: Refresh queries inside command or when calling: `await addLike(id).updates(getLikes(id))`. Use `withOverride` for optimistic updates: `await addLike(id).updates(getLikes(id).withOverride(n => n + 1))`.

### prerender

Invoked at build time to prerender result. For data that changes at most once per redeployment. In browser, prerendered data saved via Cache API, survives page reloads, cleared on new deployment.

```js
import { prerender } from '$app/server';

export const getPosts = prerender(async () => {
	const posts = await db.sql`SELECT title, slug FROM post ORDER BY published_at DESC`;
	return posts;
});
```

**Prerender arguments**: Accept validated argument. Calls found during crawling saved automatically. Specify values via `inputs` option:

```js
export const getPost = prerender(
	v.string(),
	async (slug) => { /* ... */ },
	{
		inputs: () => ['first-post', 'second-post', 'third-post']
	}
);
```

By default excluded from server bundle (can't call with non-prerendered args). Set `dynamic: true` to allow runtime calls.

### Validation errors

Generic 400 Bad Request returned for invalid data. Control message via `handleValidationError` server hook:

```js
// src/hooks.server.ts
export function handleValidationError({ event, issues }) {
	return { message: 'Nice try, hacker!' };
}
```

Opt out of validation with `'unchecked'` string instead of schema.

### getRequestEvent

Use `getRequestEvent()` inside `query`, `form`, `command` to access current RequestEvent. Useful for cookie/auth abstractions. Note: cannot set headers (except cookies in form/command), `route`/`params`/`url` relate to calling page not endpoint.

### Redirects

`redirect(...)` works inside `query`, `form`, `prerender` but not `command`.