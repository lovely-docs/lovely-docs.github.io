## Upgrading to Tailwind v4 and Svelte 5

### Key Changes
- HSL colors converted to OKLCH (non-breaking for existing v3 projects)
- `default` style deprecated in favor of `new-york`
- All components now have `data-slot` attributes for styling
- Buttons use default cursor
- `tailwindcss-animate` replaced with `tw-animate-css`

### Migration Steps

1. **Follow Tailwind v4 upgrade guide** and run the `@tailwindcss/upgrade` codemod

2. **Replace PostCSS with Vite**:
   - Delete `postcss.config.js`
   - Uninstall `@tailwindcss/postcss`, install `@tailwindcss/vite`
   - Update `vite.config.ts`:
     ```ts
     import tailwindcss from '@tailwindcss/vite';
     export default defineConfig({
       plugins: [tailwindcss(), sveltekit()],
     });
     ```

3. **Update `app.css`**:
   - Replace `@config` import with `@import "tailwindcss"`
   - Install `tw-animate-css` and import it
   - Add `@custom-variant dark (&:is(.dark *))`
   - Wrap CSS variable values in `hsl()` function
   - Replace `tailwind.config.ts` with `@theme inline` directive containing color and radius definitions
   - Remove border color compatibility styles

4. **Use new `size-*` utility**: Replace `w-4 h-4` with `size-4`

5. **Update dependencies**: `bits-ui`, `@lucide/svelte`, `tailwind-variants`, `tailwind-merge`, `clsx`, `svelte-sonner`, `paneforge`, `vaul-svelte`, `formsnap`

6. **Update `utils.ts`** (optional): Add type helpers (`WithoutChild`, `WithoutChildren`, `WithElementRef`) that were moved from `bits-ui`

7. **Update colors** (optional): Re-add all components with CLI to get new dark mode OKLCH colors

### Important Notes
- Tailwind v4 requires modern browsers with bleeding-edge features
- Existing v3 projects continue working; only new projects start with v4
- CLI can initialize new projects with v4 and Svelte 5