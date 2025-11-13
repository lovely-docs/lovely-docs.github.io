## Svelte 4 to Svelte 5 Migration

**Configuration Updates**:
- Add `registry` and aliases to `components.json`
- Install `tailwindcss-animate` plugin in `tailwind.config.js`
- Update `utils.ts` to export only `cn()` and utility types

**Dependencies**:
```bash
npm i bits-ui@latest svelte-sonner@latest @lucide/svelte@latest paneforge@next vaul-svelte@next mode-watcher@latest -D
```
Remove: `cmdk-sv`, `svelte-headless-table`, `svelte-radix`, `lucide-svelte`

**Component Migration**:
```bash
npx shadcn-svelte@latest add dialog --overwrite
```
Repeat for each component, reviewing diffs for custom behavior.

## Tailwind v4 and Svelte 5 Migration

**Key Changes**:
- HSL colors converted to OKLCH
- `default` style deprecated for `new-york`
- All components have `data-slot` attributes
- `tailwindcss-animate` replaced with `tw-animate-css`

**Setup**:
- Delete `postcss.config.js`, replace with Vite:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

**CSS Updates**:
- Replace `@config` with `@import "tailwindcss"`
- Add `@custom-variant dark (&:is(.dark *))`
- Wrap CSS variable values in `hsl()` function
- Replace `tailwind.config.ts` with `@theme inline` directive
- Use `size-4` instead of `w-4 h-4`

**Dependencies**: Update `bits-ui`, `@lucide/svelte`, `tailwind-variants`, `tailwind-merge`, `clsx`, `svelte-sonner`, `paneforge`, `vaul-svelte`, `formsnap`