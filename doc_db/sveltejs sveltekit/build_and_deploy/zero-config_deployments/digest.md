## adapter-auto

`adapter-auto` is the default adapter installed with new SvelteKit projects. It automatically detects and uses the correct adapter for your deployment environment:

- Cloudflare Pages → `@sveltejs/adapter-cloudflare`
- Netlify → `@sveltejs/adapter-netlify`
- Vercel → `@sveltejs/adapter-vercel`
- Azure Static Web Apps → `svelte-adapter-azure-swa`
- AWS via SST → `svelte-kit-sst`
- Google Cloud Run → `@sveltejs/adapter-node`

## Installation recommendation

Once you've chosen a target environment, install the specific adapter to `devDependencies`. This adds it to your lockfile and improves CI install times.

## Configuration

`adapter-auto` doesn't accept options. To use environment-specific configuration (e.g., `{ edge: true }` for Vercel or Netlify), you must install the underlying adapter directly.

## Community adapters

Add zero-config support for additional adapters by editing `adapters.js` in the adapter-auto package and submitting a pull request.