## Tailwind v4 Migration

Upgrade from Tailwind v3 to v4 with Svelte 5. Replace PostCSS with Vite, update `app.css` with CSS variables and `@theme inline` directive, remove `tailwind.config.ts`, update dependencies, and optionally refresh components for new dark mode colors.

**Key steps**:
1. Run Tailwind v4 upgrade guide and codemod
2. Replace PostCSS: uninstall `@tailwindcss/postcss`, install `@tailwindcss/vite`, update `vite.config.ts`
3. Update `app.css`: import `tw-animate-css`, add dark variant, move variables to `:root`/`.dark` with `hsl()`, add `@theme inline` mapping
4. Delete `tailwind.config.ts`
5. Use `size-*` instead of `w-* h-*`
6. Update dependencies
7. Optionally update `utils.ts` with type helpers and refresh components