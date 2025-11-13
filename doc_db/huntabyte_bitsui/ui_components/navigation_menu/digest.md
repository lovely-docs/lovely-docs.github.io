## Components

NavigationMenu provides a hierarchical menu system with these core components:

- **Root**: Manages menu state with props for `value`, `orientation` ('horizontal'|'vertical'), `delayDuration` (200ms), `skipDelayDuration` (300ms), and `dir` ('ltr'|'rtl')
- **List**: Container for menu items
- **Item**: Individual menu entry with `openOnHover` (default true) and optional `value`
- **Trigger**: Button that toggles content visibility
- **Content**: Dropdown content with `forceMount` option and interaction callbacks (`onInteractOutside`, `onFocusOutside`, `onEscapeKeydown`)
- **Link**: Navigation link with `active` state and `onSelect` callback
- **Viewport**: Optional container that renders active content with CSS variables `--bits-navigation-menu-viewport-width` and `--bits-navigation-menu-viewport-height`
- **Indicator**: Visual indicator for active trigger
- **Sub**: Nested menu component for submenus

## Usage Patterns

**Vertical orientation**: Pass `orientation="vertical"` to Root

**Flexible layouts**: Use Viewport to control where Content renders, enabling advanced animations with `data-motion` attributes ('from-start'|'from-end'|'to-start'|'to-end')

**Submenus**: Nest NavigationMenu.Sub inside Content, with its own List and Viewport

**Force mounting**: Set `forceMount` on Content and Viewport to keep DOM elements persistent (useful for SEO), then use `data-state` attributes to control visibility

**Click-to-open**: Set `openOnHover={false}` on Item to require click instead of hover; menu won't auto-close on pointer leave

**Indicator**: Add Indicator component to highlight active trigger with animations

## Animation

Content supports `data-motion` for directional animations. Viewport exposes CSS variables for smooth size transitions between different content dimensions.