## Avatar Component

Displays images with automatic loading state handling and fallback placeholders using compound components (Root, Image, Fallback).

### Basic Usage
```svelte
<Avatar.Root>
  <Avatar.Image src="https://github.com/huntabyte.png" alt="avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### Reusable Component
```svelte
<script lang="ts">
  import { Avatar, type WithoutChildrenOrChild } from "bits-ui";
  let { src, alt, fallback, ref = $bindable(null), imageRef = $bindable(null), fallbackRef = $bindable(null), ...restProps } = $props();
</script>
<Avatar.Root {...restProps} bind:ref>
  <Avatar.Image {src} {alt} bind:ref={imageRef} />
  <Avatar.Fallback bind:ref={fallbackRef}>{fallback}</Avatar.Fallback>
</Avatar.Root>
```

### Skip Loading Check
```svelte
<Avatar.Root loadingStatus="loaded">
  <Avatar.Image src={localAvatar} alt="avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### API

**Avatar.Root**: `loadingStatus` (bindable, 'loading'|'loaded'|'error'), `onLoadingStatusChange` (callback), `delayMs` (number, default 0), `ref` (bindable), `children`/`child` (snippets)

**Avatar.Image**: `ref` (bindable), `children`/`child` (snippets)

**Avatar.Fallback**: `ref` (bindable), `children`/`child` (snippets)

Data attributes: `data-status`, `data-avatar-root`/`data-avatar-image`/`data-avatar-fallback`