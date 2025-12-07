# Aspect Ratio Documentation

Displays content while maintaining a specified aspect ratio.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import { AspectRatio } from "bits-ui";
</script>
<AspectRatio.Root
  ratio={14 / 9}
  class="rounded-15px scale-[0.8] bg-transparent"
>
  <img
    src="/abstract.png"
    alt="an abstract painting"
    class="h-full w-full rounded-[15px] object-cover"
  />
</AspectRatio.Root>
```

## Architecture

- **Root**: The root component which contains the aspect ratio logic

## Structure

Here's an overview of how the Aspect Ratio component is structured in code:

```svelte
<script lang="ts">
  import { AspectRatio } from "bits-ui";
</script>
<AspectRatio.Root />
```

## Reusable Component

If you plan on using a lot of `AspectRatio` components throughout your application, you can create a reusable component that combines the `AspectRatio.Root` and whatever other elements you'd like to render within it. In the following example, we're creating a reusable `MyAspectRatio` component that takes in a `src` prop and renders an `img` element with the `src` prop.

MyAspectRatio.svelte

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

You can then use the `MyAspectRatio` component in your application like so:

+page.svelte

```svelte
<script lang="ts">
  import MyAspectRatio from "$lib/components/MyAspectRatio.svelte";
</script>
<MyAspectRatio
  src="https://example.com/image.jpg"
  alt="an abstract painting"
  ratio={4 / 3}
/>
```

## Custom Ratio

Use the `ratio` prop to set a custom aspect ratio for the image.

```svelte
<AspectRatio.Root ratio={16 / 9}>
  <!-- ... -->
</AspectRatio.Root>
```

## API Reference

### AspectRatio.Root

The aspect ratio component.

| Property        | Type                                                                  | Description                                                                                                                                   | Details |
| --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `ratio`         | `number`                                                              | The desired aspect ratio.`Default: 1`                                                                                                         |         |
| `ref` $bindable | `HTMLDivElement`                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                             | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute           | Value | Description                  | Details |
| ------------------------ | ----- | ---------------------------- | ------- |
| `data-aspect-ratio-root` | `''`  | Present on the root element. |         |

[Previous Alert Dialog](/docs/components/alert-dialog) [Next Avatar](/docs/components/avatar)