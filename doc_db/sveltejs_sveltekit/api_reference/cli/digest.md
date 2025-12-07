SvelteKit projects use Vite for most CLI operations, accessed via npm scripts:
- `vite dev` — start development server
- `vite build` — build production version
- `vite preview` — run production build locally

SvelteKit provides its own CLI command for project initialization:

**svelte-kit sync** — generates `tsconfig.json` and all type definitions (importable as `./$types` in routing files). Automatically runs as the `prepare` npm lifecycle script when creating new projects, so manual invocation is rarely needed.