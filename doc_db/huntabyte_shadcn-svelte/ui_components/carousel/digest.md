## Carousel

A carousel component built on Embla Carousel with motion and swipe support.

### Installation

```bash
npx shadcn-svelte@latest add carousel -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

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

Use the `basis` utility class on `<Carousel.Item />` to control item size:

```svelte
<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item class="basis-1/3">...</Carousel.Item>
    <Carousel.Item class="md:basis-1/2 lg:basis-1/3">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Spacing Between Items

Use `pl-[VALUE]` on `<Carousel.Item />` and `-ml-[VALUE]` on `<Carousel.Content />`:

```svelte
<Carousel.Root>
  <Carousel.Content class="-ml-4 md:-ml-6">
    <Carousel.Item class="pl-4 md:pl-6">...</Carousel.Item>
    <Carousel.Item class="pl-4 md:pl-6">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Orientation

Set carousel direction with the `orientation` prop:

```svelte
<Carousel.Root orientation="vertical" class="h-[200px]">
  <Carousel.Content class="-mt-1">
    <Carousel.Item class="pt-1">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

Accepts `"vertical"` or `"horizontal"`.

### Options

Pass Embla Carousel options via the `opts` prop:

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### API & State Management

Use the `setApi` callback to access the carousel API instance:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  
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
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>

<div>Slide {current} of {count}</div>
```

Available API methods: `scrollSnapList()`, `selectedScrollSnap()`, and event listeners via `api.on()`.

### Events

Listen to carousel events using the API instance:

```svelte
<script lang="ts">
  let api = $state<CarouselAPI>();
  
  $effect(() => {
    if (api) {
      api.on("select", () => {
        // Handle selection change
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  ...
</Carousel.Root>
```

### Plugins

Add Embla Carousel plugins via the `plugins` prop:

```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root
  plugins={[plugin]}
  onmouseenter={plugin.stop}
  onmouseleave={plugin.reset}
>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

Refer to Embla Carousel documentation for available plugins and options.