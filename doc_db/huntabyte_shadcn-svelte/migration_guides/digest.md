## Svelte 4 to Svelte 5 Migration

**Update configs:**
- `components.json`: Add `registry: "https://shadcn-svelte.com/registry"` and aliases for `components`, `utils`, `ui`, `hooks`, `lib`
- `tailwind.config.js`: Install `tailwindcss-animate`, add sidebar color variables and accordion/caret-blink animations
- `utils.ts`: Export only `cn()` function and utility types (`WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild`, `WithElementRef`)

**Update dependencies:**
```bash
npm i bits-ui@^1.0.0 svelte-sonner@^1.0.0 @lucide/svelte@^0.482.0 paneforge@^1.0.0-next.5 vaul-svelte@^1.0.0-next.7 mode-watcher@^1.0.0 -D
```

**Deprecated packages** (remove after migration):
- `cmdk-sv` → use Bits UI's `Command`
- `svelte-headless-table` → use `@tanstack/table-core`
- `svelte-radix` → use `@lucide/svelte`
- `lucide-svelte` → use `@lucide/svelte`

**Migrate components:**
```bash
git add . && git commit -m 'before migration'
npx shadcn-svelte@latest add <component> -y -o
```
(`-y`: skip confirmation, `-o`: overwrite existing files)

---

## Tailwind v4 Migration

**Replace PostCSS with Vite:**
- Delete `postcss.config.js`
- `npm uninstall @tailwindcss/postcss && npm i @tailwindcss/vite -D`
- Update `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

**Update `app.css`:**
- Replace `tailwindcss-animate` with `tw-animate-css`
- Import: `@import "tailwindcss"; @import "tw-animate-css";`
- Add custom dark variant: `@custom-variant dark (&:is(.dark *));`
- Move CSS variables to `:root` and `.dark` selectors, wrap colors in `hsl()`
- Replace `tailwind.config.ts` with `@theme inline` directive:
```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --color-background: var(--background);
  /* ... all color/radius mappings */
}
```

**Update dependencies:**
```bash
npm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest
```

**Update `utils.ts`:** Add type helpers (`WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild`, `WithElementRef`)

**Re-add components with new colors:**
```bash
npx shadcn-svelte@latest add --all --overwrite
```

**Key changes:** Use `size-*` utility instead of `w-* h-*`, HSL colors converted to OKLCH, `default` style deprecated (use `new-york`)