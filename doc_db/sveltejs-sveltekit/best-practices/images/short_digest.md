## Image Optimization

**Vite built-in**: Auto-processes imported assets with hashing and inlining.

**@sveltejs/enhanced-img**: Build-time plugin generating avif/webp formats, multiple sizes, and intrinsic dimensions.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
```

Dynamic imports:
```svelte
<script>
	import MyImage from './image.jpg?enhanced';
</script>
<enhanced:img src={MyImage} alt="text" />
```

Responsive sizing:
```svelte
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

Per-image transforms:
```svelte
<enhanced:img src="./image.jpg?blur=15" alt="text" />
```

**CDN approach**: For dynamic/external images using `@unpic/svelte` or provider-specific libraries.

**Best practices**: Mix approaches as needed, serve via CDN, provide 2x resolution images, use `sizes` for large images, set `fetchpriority="high"` for LCP images, avoid `em`/`rem` in `sizes`.