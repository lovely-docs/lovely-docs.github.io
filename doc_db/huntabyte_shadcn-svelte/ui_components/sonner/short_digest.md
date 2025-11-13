Toast component for Svelte. Install with `pnpm dlx shadcn-svelte@latest add sonner`, add `<Toaster />` to root layout, then use `toast()` or `toast.success()` with message and optional config:

```svelte
<Button onclick={() => toast.success("Event created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: { label: "Undo", onClick: () => console.info("Undo") }
})}>Show Toast</Button>
```