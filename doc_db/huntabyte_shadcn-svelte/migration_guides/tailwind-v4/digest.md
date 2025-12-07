## Upgrading to Tailwind v4 and Svelte 5

**Overview**: Migration guide for existing Svelte 5 + Tailwind v3 projects to Tailwind v4. New projects can use `@latest` CLI directly. HSL colors convert to OKLCH (non-breaking for v3 projects). Default style changes from `default` to `new-york`.

**Key Changes**:
- All components updated for Tailwind v4 and Svelte 5
- Every element now has `data-slot` attribute for styling
- Buttons use default cursor
- HSL colors converted to OKLCH

**Upgrade Steps**:

1. **Follow Tailwind v4 Upgrade Guide**: Run official upgrade and use `@tailwindcss/upgrade` codemod to remove deprecated utilities and update config.

2. **Replace PostCSS with Vite**:
   - Delete `postcss.config.js`
   - Uninstall `@tailwindcss/postcss`: `npm uninstall @tailwindcss/postcss`
   - Install `@tailwindcss/vite`: `npm i @tailwindcss/vite -D`
   - Update `vite.config.ts`:
     ```ts
     import tailwindcss from '@tailwindcss/vite';
     export default defineConfig({
       plugins: [tailwindcss(), sveltekit()],
     });
     ```

3. **Update `app.css`**:
   - Replace `tailwindcss-animate` with `tw-animate-css`: `npm uninstall tailwindcss-animate && npm i tw-animate-css -D`
   - Import both: `@import "tailwindcss"; @import "tw-animate-css";`
   - Add dark mode variant: `@custom-variant dark (&:is(.dark *));`
   - Remove border color compatibility styles
   - Move CSS variables to `:root` and `.dark` selectors, wrap color values in `hsl()`:
     ```css
     :root {
       --background: hsl(0 0% 100%);
       --foreground: hsl(240 10% 3.9%);
       /* ... more variables ... */
       --radius: 0.5rem;
     }
     .dark {
       --background: hsl(240 10% 3.9%);
       /* ... dark mode variables ... */
     }
     ```
   - Add `@theme inline` directive to replace `tailwind.config.ts`:
     ```css
     @theme inline {
       --radius-sm: calc(var(--radius) - 4px);
       --radius-md: calc(var(--radius) - 2px);
       --radius-lg: var(--radius);
       --radius-xl: calc(var(--radius) + 4px);
       --color-background: var(--background);
       --color-foreground: var(--foreground);
       /* ... map all color variables ... */
     }
     ```
   - Remove `@config '../tailwind.config.ts'` import

4. **Delete `tailwind.config.ts`** after verifying styles work.

5. **Use new `size-*` utility**: Replace `w-* h-*` with `size-*` (e.g., `w-4 h-4` → `size-4`).

6. **Update dependencies**: `npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest`

7. **Update `utils.ts`** (optional): Add type helpers previously from `bits-ui`:
   ```ts
   export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
   export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
   export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
   export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
   ```
   Then replace imports: `import type { WithElementRef } from "$lib/utils.js";`

8. **Update colors** (optional): Re-add components to get new dark mode colors:
   ```bash
   git add . && git commit -m '...'
   npm dlx shadcn-svelte@latest add --all --overwrite
   ```
   Then update dark mode colors in `app.css` to new OKLCH values per theming reference.