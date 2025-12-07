## Image Optimization Techniques

Three approaches for optimizing images in SvelteKit projects:

### Vite's Built-in Handling
Automatically processes imported assets with hashing for caching and inlining of small assets:
```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>
<img alt="The project logo" src={logo} />
```

### @sveltejs/enhanced-img Plugin
Provides automatic image optimization with multiple formats (avif, webp), responsive sizing, intrinsic dimensions, and EXIF stripping. Only works with build-time accessible images.

**Setup:**
```sh
npm i -D @sveltejs/enhanced-img
```
```js
import { enhancedImages } from '@sveltejs/enhanced-img';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()]
});
```

**Basic usage:**
```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

**Dynamic imports:**
```svelte
<script>
	import MyImage from './path/to/your/image.jpg?enhanced';
</script>
<enhanced:img src={MyImage} alt="some alt text" />
```

**With glob:**
```svelte
<script>
	const imageModules = import.meta.glob(
		'/path/to/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}',
		{ eager: true, query: { enhanced: true } }
	)
</script>
{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="some alt text" />
{/each}
```

**Responsive sizing with srcset:**
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

**Custom widths:**
```svelte
<enhanced:img
  src="./image.png?w=1280;640;400"
  sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
/>
```

**Per-image transforms:**
```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

Width and height are automatically inferred and added to prevent layout shift. Use CSS to override dimensions if needed.

### CDN-based Dynamic Loading
For images not accessible at build time (CMS, database, backend). Provides dynamic optimization and flexibility but may have setup overhead and costs. Libraries like `@unpic/svelte` provide CDN-agnostic support; specific CDNs (Cloudinary) and CMS platforms (Contentful, Storyblok, Contentstack) offer Svelte integrations.

## Best Practices

- Mix and match all three solutions in one project as appropriate
- Serve all images via CDN to reduce latency
- Provide original images at 2x display width for HiDPI devices; processing can downscale but not upscale
- For large images (hero images, >400px width), specify `sizes` to serve smaller versions on smaller devices
- For important images (LCP), set `fetchpriority="high"` and avoid `loading="lazy"`
- Constrain images with container/styling and use `width`/`height` to prevent layout shift
- Always provide good `alt` text
- Don't use `em` or `rem` in `sizes` declarations; they're relative to user's default font-size, not CSS-modified values