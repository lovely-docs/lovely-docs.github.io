## Carousel Component

Built on Embla Carousel with motion and swipe support.

### Installation
```bash
pnpm dlx shadcn-svelte@latest add carousel
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
- Size items: `<Carousel.Item class="md:basis-1/2 lg:basis-1/3">`
- Spacing: `<Carousel.Content class="-ml-4">` + `<Carousel.Item class="pl-4">`

### Orientation
```svelte
<Carousel.Root orientation="vertical">
```

### Options
```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
```

### API Access
```svelte
<script lang="ts">
  let api = $state<CarouselAPI>();
  $effect(() => {
    if (api) {
      api.on("select", () => { /* ... */ });
    }
  });
</script>
<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
```

### Plugins
```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>
<Carousel.Root plugins={[plugin]} onmouseenter={plugin.stop} onmouseleave={plugin.reset}>
```