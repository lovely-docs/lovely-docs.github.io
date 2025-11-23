## Tailwind v4 Migration

Upgrade from Tailwind v3 to v4 and Svelte 4 to v5. Key changes: CSS-based `@theme inline` config replaces `tailwind.config.ts`, PostCSS replaced with Vite, HSL colors converted to OKLCH, dark mode colors updated.

**Steps:**
1. Follow official Tailwind v4 upgrade guide with `@tailwindcss/upgrade` codemod
2. Replace PostCSS with Vite: delete `postcss.config.js`, uninstall `@tailwindcss/postcss`, install `@tailwindcss/vite -D`, update `vite.config.ts` to include `tailwindcss()` plugin
3. Update `app.css`: import `tw-animate-css` instead of `tailwindcss-animate`, add `@custom-variant dark (&:is(.dark *));`, move CSS variables to `:root`/`.dark` with `hsl()` wrapping, replace config with `@theme inline` block, delete `tailwind.config.ts`
4. Replace `w-* h-*` with `size-*` utility
5. Update dependencies: `npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest`
6. Update `utils.ts` with type helpers from `bits-ui`
7. Optional: re-add components with `npx shadcn-svelte@latest add --all --overwrite` to get new dark mode colors