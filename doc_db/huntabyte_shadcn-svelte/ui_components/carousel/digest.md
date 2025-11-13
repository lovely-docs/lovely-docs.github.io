## Carousel Component

A carousel component built on Embla Carousel with motion and swipe support.

### Installation

```bash
pnpm dlx shadcn-svelte@latest add carousel
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
</script>

<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
    <Carousel.Item>...</Carousel.Item>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

### Sizing Items

Use `basis` utility classes on `Carousel.Item` to control item size:

```svelte
<Carousel.Root class="w-full max-w-sm">
  <Carousel.Content>
    <Carousel.Item class="md:basis-1/2 lg:basis-1/3">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Spacing Between Items

Use `pl-[VALUE]` on items and `-ml-[VALUE]` on content:

```svelte
<Carousel.Root>
  <Carousel.Content class="-ml-4">
    <Carousel.Item class="pl-4">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Orientation

```svelte
<Carousel.Root orientation="vertical" opts={{ align: "start" }}>
  <Carousel.Content class="-mt-1 h-[200px]">
    <Carousel.Item class="pt-1">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Options

Pass options via `opts` prop (see Embla Carousel docs for full list):

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  ...
</Carousel.Root>
```

### API Access

Use `setApi` callback to access carousel instance:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  let api = $state<CarouselAPI>();
  const count = $derived(api ? api.scrollSnapList().length : 0);
  let current = $state(0);
  
  $effect(() => {
    if (api) {
      current = api.selectedScrollSnap() + 1;
      api.on("select", () => {
        current = api!.selectedScrollSnap() + 1;
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  ...
</Carousel.Root>

<div>Slide {current} of {count}</div>
```

### Events

Listen to carousel events via the API instance:

```svelte
<script lang="ts">
  let api = $state<CarouselAPI>();
  
  $effect(() => {
    if (api) {
      api.on("select", () => {
        // handle selection
      });
    }
  });
</script>
```

### Plugins

Add plugins like Autoplay:

```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root
  plugins={[plugin]}
  onmouseenter={plugin.stop}
  onmouseleave={plugin.reset}
>
  ...
</Carousel.Root>
```