## Avatar Component

Image element with fallback text for user avatars.

### Installation
```bash
npm install shadcn-svelte@latest add avatar
```

### Usage
```svelte
<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
```

Supports custom styling via `class` prop and can be grouped with overlapping effects.