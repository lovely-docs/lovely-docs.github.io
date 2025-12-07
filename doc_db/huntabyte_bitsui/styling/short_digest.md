## Styling Approaches

Components expose `class` and `style` props. Five main approaches:

1. **CSS Frameworks**: Pass framework classes directly
2. **Data Attributes**: Target `[data-component-name]` selectors in global CSS
3. **Global Classes**: Define CSS classes and apply via `class` prop
4. **Scoped Styles**: Use `child` snippet for Svelte scoped styles
5. **Style Prop**: String or object, merged with internal styles

## Styling States

Components expose state via data attributes (`[data-state="open"]`, `[data-disabled]`) and CSS variables (`--bits-accordion-content-height`, `--bits-select-anchor-width`).

## Advanced Techniques

Combine data attributes with CSS variables for animations. Use `@keyframes` with state selectors for custom transitions on component state changes.