## Tailwind v4 Migration

**Key changes**: HSL→OKLCH colors, `default` style deprecated, `tailwindcss-animate`→`tw-animate-css`, `data-slot` attributes added

**Main steps**:
1. Run Tailwind v4 upgrade guide and codemod
2. Replace PostCSS with Vite: uninstall `@tailwindcss/postcss`, install `@tailwindcss/vite`, update `vite.config.ts`
3. Update `app.css`: import `tailwindcss` and `tw-animate-css`, add `@custom-variant dark`, wrap colors in `hsl()`, replace config file with `@theme inline`
4. Use `size-*` utility instead of `w-* h-*`
5. Update dependencies to latest versions
6. Optionally update `utils.ts` with moved type helpers and re-add components for new dark mode colors