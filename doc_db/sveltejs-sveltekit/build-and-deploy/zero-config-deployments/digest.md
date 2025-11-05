**adapter-auto** automatically detects and uses the correct deployment adapter for your environment. It's installed by default with `npx sv create`.

Supported environments:
- Cloudflare Pages
- Netlify
- Vercel
- Azure Static Web Apps
- AWS via SST
- Google Cloud Run

Once you've chosen a target environment, install the specific adapter to your devDependencies. This adds it to your lockfile and improves CI install times.

To use environment-specific configuration options (like `{ edge: true }` in adapter-vercel or adapter-netlify), you must install the underlying adapter directly — adapter-auto doesn't accept options.

Community adapters can be added to zero-config support by editing adapters.js in the adapter-auto package and submitting a pull request.