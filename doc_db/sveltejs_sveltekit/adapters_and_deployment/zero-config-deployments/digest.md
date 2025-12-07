## Zero-config deployments with adapter-auto

`adapter-auto` is the default adapter installed when creating a new SvelteKit project with `npx sv create`. It automatically detects and installs the correct adapter for your deployment environment at build time.

### Supported environments

- Cloudflare Pages via `@sveltejs/adapter-cloudflare`
- Netlify via `@sveltejs/adapter-netlify`
- Vercel via `@sveltejs/adapter-vercel`
- Azure Static Web Apps via `svelte-adapter-azure-swa`
- AWS via SST using `svelte-kit-sst`
- Google Cloud Run via `@sveltejs/adapter-node`

### Installation recommendation

Once you've chosen a target environment, install the specific adapter to your `devDependencies`. This adds the adapter to your lockfile and improves install times on CI.

### Environment-specific configuration

To use configuration options like `{ edge: true }` in adapter-vercel or adapter-netlify, you must install the underlying adapter directly. `adapter-auto` does not accept any configuration options itself.

### Adding community adapters

Community adapters can be added to zero-config support by editing the `adapters.js` file in the adapter-auto package and opening a pull request to the SvelteKit repository.