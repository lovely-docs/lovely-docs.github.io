In legacy mode, use `<svelte:component>` to dynamically render components. When the `this` expression changes, the component instance is destroyed and recreated.

```svelte
<svelte:component this={MyComponent} />
```

If `this` is falsy, no component is rendered.

In runes mode, `<MyComponent>` will re-render automatically when the component value changes, making `<svelte:component>` unnecessary.