## Image Optimization

**Vite built-in**: Auto-processes imported assets with hashing and inlining.
```svelte
import logo from '$lib/assets/logo.png';
<img src={logo} />
```

**@sveltejs/enhanced-img**: Build-time plugin generating avif/webp, multiple sizes, intrinsic dimensions. Install and add to vite.config.js before sveltekit plugin.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

Dynamic imports:
```svelte
import MyImage from './image.jpg?enhanced';
<enhanced:img src={MyImage} alt="text" />
```

Specify `sizes` for responsive images:
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)" />
```

Custom widths:
```svelte
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px" />
```

Per-image transforms:
```svelte
<enhanced:img src="./image.jpg?blur=15" alt="text" />
```

**CDN approach**: For runtime images from CMS/database. Use `@unpic/svelte` or provider-specific libraries.

**Best practices**: Mix approaches per project, serve via CDN, provide 2x resolution images, use `sizes` for large images, set `fetchpriority="high"` for LCP images, always provide `alt` text, avoid `em`/`rem` in `sizes`.