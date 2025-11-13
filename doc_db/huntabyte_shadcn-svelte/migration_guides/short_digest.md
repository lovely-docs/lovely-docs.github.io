## Svelte 5 Migration
Update `components.json` with registry and aliases. Upgrade dependencies: `bits-ui`, `svelte-sonner`, `@lucide/svelte`, `paneforge`, `vaul-svelte`, `mode-watcher`. Remove `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`. Re-add components: `npx shadcn-svelte@latest add dialog --overwrite`

## Tailwind v4 Migration
Replace PostCSS with Vite plugin. Update `app.css`: import tailwindcss, add dark variant, wrap CSS variables in `hsl()`, use `@theme inline`. Replace `tailwindcss-animate` with `tw-animate-css`. Use `size-4` instead of `w-4 h-4`.