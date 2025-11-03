## Legacy Mode Component Rendering

In legacy mode, `<MyComponent>` does not re-render when the component value changes. Use `<svelte:component>` instead, which destroys and recreates the component instance when its `this` expression changes:

```svelte
<svelte:component this={MyComponent} />
```

If `this` is falsy, no component is rendered.

Note: In runes mode (Svelte 5+), `<MyComponent>` automatically re-renders on value changes, making `<svelte:component>` unnecessary.