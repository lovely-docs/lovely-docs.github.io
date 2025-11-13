## Unit and Component Tests with Vitest

Install Vitest and configure `vite.config.js` to use browser entry points:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: process.env.VITEST
		? { conditions: ['browser'] }
		: undefined
});
```

Write unit tests for `.js/.ts` files:

```js
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
	double.set(5);
	expect(double.value).toEqual(10);
});
```

Use runes in test files by naming them `.svelte.test.js`. For tests using effects, wrap in `$effect.root()` and use `flushSync()` to execute pending effects synchronously.

### Component Testing

Install jsdom and configure `vite.config.js` with `test: { environment: 'jsdom' }`.

Use Svelte's `mount` API to test components:

```js
import { mount, unmount, flushSync } from 'svelte';
import Component from './Component.svelte';

test('Component', () => {
	const component = mount(Component, {
		target: document.body,
		props: { initial: 0 }
	});
	expect(document.body.innerHTML).toBe('<button>0</button>');
	document.body.querySelector('button').click();
	flushSync();
	expect(document.body.innerHTML).toBe('<button>1</button>');
	unmount(component);
});
```

Use `@testing-library/svelte` for higher-level component testing that's less brittle to DOM structure changes.

## Component Tests with Storybook

Install Storybook via `npx sv add storybook`. Create stories with interaction tests using the `play` function:

```svelte
import { defineMeta, expect, fn } from '@storybook/addon-svelte-csf';
import LoginForm from './LoginForm.svelte';

const { Story } = defineMeta({
	component: LoginForm,
	args: { onSubmit: fn() }
});

export const FilledForm = {
	play: async ({ args, canvas, userEvent }) => {
		await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
		await userEvent.click(canvas.getByRole('button'));
		await expect(args.onSubmit).toHaveBeenCalledTimes(1);
	}
};
```

## End-to-End Tests with Playwright

Setup Playwright via CLI or `npm init playwright`. Configure `playwright.config.js` to start your application:

```js
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};
```

Write E2E tests that interact with the DOM:

```js
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```