SvelteKit uses Vite for its CLI. Common commands are run via npm scripts:

- `vite dev` — start development server
- `vite build` — build production version
- `vite preview` — run production build locally

SvelteKit provides its own CLI command:

**svelte-kit sync** — generates `tsconfig.json` and type definitions (importable as `./$types` in routing files). Runs automatically as the `prepare` npm script during project setup, so manual execution is rarely needed.