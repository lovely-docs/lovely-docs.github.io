## Avatar Component

Compound component for displaying images with loading states and fallbacks.

**Structure**: Avatar.Root (container) → Avatar.Image + Avatar.Fallback

**Basic usage**:
```svelte
<Avatar.Root>
  <Avatar.Image src="url" alt="text" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

**Key props**:
- `loadingStatus` (bindable): 'loading' | 'loaded' | 'error'
- `delayMs`: Delay before showing image (prevents flickering)
- `onLoadingStatusChange`: Callback for state changes

**Skip loading check** for guaranteed images:
```svelte
<Avatar.Root loadingStatus="loaded">
  <Avatar.Image src={localAsset} alt="text" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

**Data attributes**: `data-status`, `data-avatar-root`, `data-avatar-image`, `data-avatar-fallback`