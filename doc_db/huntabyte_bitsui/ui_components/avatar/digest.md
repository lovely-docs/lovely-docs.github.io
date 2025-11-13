## Avatar Component

A compound component for displaying user/entity images with automatic loading state handling and fallback support.

### Structure
- **Avatar.Root**: Container managing image and fallback state
- **Avatar.Image**: Displays the image
- **Avatar.Fallback**: Shows during loading or on failure

### Basic Usage
```svelte
<Avatar.Root>
  <Avatar.Image src="https://github.com/huntabyte.png" alt="Avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### Key Features
- Smart image loading with state detection (loading/loaded/error)
- Fallback display when images unavailable or slow
- `delayMs` prop to prevent flickering on quick loads
- `loadingStatus` bindable prop to track state externally
- `onLoadingStatusChange` callback for state changes

### Skip Loading Check
For guaranteed-available images (local assets):
```svelte
<Avatar.Root loadingStatus="loaded">
  <Avatar.Image src={localAvatar} alt="Avatar" />
  <Avatar.Fallback>HB</Avatar.Fallback>
</Avatar.Root>
```

### Reusable Component Pattern
Create a wrapper component accepting `src`, `alt`, `fallback` props and spread remaining props to Avatar.Root for consistent styling across your app.

### Data Attributes
- `data-status`: 'loading' | 'loaded' | 'error'
- `data-avatar-root`, `data-avatar-image`, `data-avatar-fallback`: Present on respective elements