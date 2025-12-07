## Carousel

A carousel component built on Embla Carousel with motion and swipe support.

### Installation

```bash
npx shadcn-svelte@latest add carousel -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Carousel.Root>
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

### Sizing Items

Use `basis` utility classes on `<Carousel.Item />`:

```svelte
<Carousel.Root class="w-full max-w-sm">
  <Carousel.Content>
    <Carousel.Item class="basis-1/3">...</Carousel.Item>
    <Carousel.Item class="md:basis-1/2 lg:basis-1/3">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Spacing Between Items

Use `pl-[VALUE]` on items and `-ml-[VALUE]` on content:

```svelte
<Carousel.Root>
  <Carousel.Content class="-ml-4 md:-ml-6">
    <Carousel.Item class="pl-4 md:pl-6">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### Orientation

```svelte
<Carousel.Root orientation="vertical" class="w-full max-w-xs">
  <Carousel.Content class="-mt-1 h-[200px]">
    <Carousel.Item class="pt-1">...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

Use `orientation="vertical | horizontal"`.

### Options

Pass options via the `opts` prop (see Embla Carousel docs for full list):

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>
```

### API & Events

Get carousel instance via `setApi` callback:

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
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel.Root>

<div>Slide {current} of {count}</div>
```

Listen to events with `api.on("select", callback)`.

### Plugins

Add plugins via the `plugins` prop:

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

See Embla Carousel docs for available plugins.