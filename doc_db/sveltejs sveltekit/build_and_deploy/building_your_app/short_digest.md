SvelteKit builds in two stages: Vite optimizes your code, then an adapter tunes it for your target environment. Prevent build-time code execution by checking `building` from `$app/environment`:

```js
import { building } from '$app/environment';
if (!building) {
	setupMyDatabase();
}
```

Preview with `vite preview`, but note it doesn't perfectly reproduce your deployed app.