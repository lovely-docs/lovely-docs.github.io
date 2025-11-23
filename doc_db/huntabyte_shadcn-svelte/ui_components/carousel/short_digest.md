## Carousel

Embla Carousel-based component with motion and swipe support.

### Installation

```bash
npx shadcn-svelte@latest add carousel -y -o
```

### Basic Usage

```svelte
<Carousel.Root>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

### Sizing & Spacing

```svelte
<Carousel.Root>
  <Carousel.Content class="-ml-4">
    <Carousel.Item class="basis-1/3 pl-4 md:basis-1/2">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Orientation

```svelte
<Carousel.Root orientation="vertical" class="h-[200px]">
  <Carousel.Content class="-mt-1">
    <Carousel.Item class="pt-1">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Options

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  ...
</Carousel.Root>
```

### API & Events

```svelte
<script lang="ts">
  let api = $state<CarouselAPI>();
  let current = $state(0);
  const count = $derived(api?.scrollSnapList().length ?? 0);
  
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
```

### Plugins

```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root plugins={[plugin]} onmouseenter={plugin.stop} onmouseleave={plugin.reset}>
  ...
</Carousel.Root>
```