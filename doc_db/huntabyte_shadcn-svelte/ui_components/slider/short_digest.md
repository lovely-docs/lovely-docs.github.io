## Slider

Range input component with single or multiple thumbs.

```bash
npx shadcn-svelte@latest add slider -y -o
```

Single value: `<Slider type="single" bind:value max={100} step={1} />`

Multiple values: `<Slider type="multiple" bind:value max={100} step={1} />`

Vertical: `<Slider type="single" orientation="vertical" bind:value max={100} step={1} />`