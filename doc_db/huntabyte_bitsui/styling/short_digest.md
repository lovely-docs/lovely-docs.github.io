## Styling Methods

- **CSS Frameworks**: Pass classes directly to components
- **Data Attributes**: Target with `[data-component-name]` selectors
- **Global Classes**: Define and apply via `class` prop
- **Scoped Styles**: Use `child` snippet for Svelte scoped styles
- **Style Prop**: Inline styles as string or object

## State Styling

Use data attributes like `[data-state="open"]` and `[data-disabled]` to style based on component state. Access internal values via CSS variables like `--bits-accordion-content-height`.

## Animations

Combine state attributes with CSS variables and keyframes:
```css
[data-accordion-content][data-state="open"] {
  animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```