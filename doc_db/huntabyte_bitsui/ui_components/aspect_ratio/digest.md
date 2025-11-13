## AspectRatio Component

A component that maintains a specified aspect ratio for its content.

### Basic Usage

```svelte
<script lang="ts">
  import { AspectRatio } from "bits-ui";
</script>
<AspectRatio.Root ratio={14 / 9}>
  <img src="/abstract.png" alt="an abstract painting" />
</AspectRatio.Root>
```

### Reusable Component Pattern

Create a wrapper component that accepts `src` and `alt` props:

```svelte
<script lang="ts">
  import { AspectRatio, type WithoutChildrenOrChild } from "bits-ui";
  let {
    src,
    alt,
    ref = $bindable(null),
    imageRef = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<AspectRatio.RootProps> & {
    src: string;
    alt: string;
    imageRef?: HTMLImageElement | null;
  } = $props();
</script>
<AspectRatio.Root {...restProps} bind:ref>
  <img {src} {alt} bind:this={imageRef} />
</AspectRatio.Root>
```

Then use it as:
```svelte
<MyAspectRatio src="https://example.com/image.jpg" alt="painting" ratio={4 / 3} />
```

### API

**AspectRatio.Root** props:
- `ratio` (number): The desired aspect ratio. Default: 1
- `ref` ($bindable HTMLDivElement): Reference to the underlying DOM element
- `children` (Snippet): Content to render
- `child` (Snippet): For render delegation

Data attribute: `data-aspect-ratio-root` on the root element.