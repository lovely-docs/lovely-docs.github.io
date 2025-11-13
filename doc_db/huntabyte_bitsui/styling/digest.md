## Styling Approaches

Bits UI ships with zero styles by default. All components that render HTML elements expose `class` and `style` props.

**CSS Frameworks**: Pass framework classes directly to components:
```svelte
<Accordion.Trigger class="h-12 w-full bg-blue-500 hover:bg-blue-600">Click me</Accordion.Trigger>
```

**Data Attributes**: Target components using data attributes in CSS:
```css
[data-accordion-trigger] {
  height: 3rem;
  background-color: #3182ce;
}
```

**Global Classes**: Define reusable classes and apply them via the `class` prop.

**Scoped Styles**: Use the `child` snippet to bring elements into component scope for Svelte scoped styles.

**Style Prop**: Pass inline styles as string or object, merged with internal styles:
```svelte
<Accordion.Trigger style={{ backgroundColor: "#3182ce", padding: "1rem" }}>
  Click me
</Accordion.Trigger>
```

## Styling Component States

Components expose state via data attributes and CSS variables.

**State Data Attributes**:
```css
[data-accordion-trigger][data-state="open"] { background-color: #f0f0f0; }
[data-accordion-trigger][data-disabled] { opacity: 0.5; }
```

**CSS Variables**: Access internal values like `--bits-select-anchor-width` or `--bits-accordion-content-height`.

## Advanced Techniques

Combine data attributes with CSS variables for animations:
```css
[data-accordion-content] {
  overflow: hidden;
  transition: height 300ms ease-out;
  height: 0;
}
[data-accordion-content][data-state="open"] {
  height: var(--bits-accordion-content-height);
}
```

Use keyframe animations with state attributes for complex transitions:
```css
@keyframes accordionOpen {
  0% { height: 0; opacity: 0; }
  100% { height: var(--bits-accordion-content-height); opacity: 1; }
}
[data-accordion-content][data-state="open"] {
  animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```