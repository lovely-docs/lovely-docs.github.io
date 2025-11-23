## Aspect Ratio

Constrains content to a specific aspect ratio using the `AspectRatio` component with a `ratio` prop:

```svelte
<AspectRatio ratio={16 / 9} class="bg-muted">
  <img src="..." alt="..." class="rounded-md object-cover" />
</AspectRatio>
```

Install: `npx shadcn-svelte@latest add aspect-ratio -y -o`