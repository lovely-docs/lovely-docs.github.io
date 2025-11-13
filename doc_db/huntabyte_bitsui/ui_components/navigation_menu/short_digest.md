## Components

Root, List, Item, Trigger, Content, Link, Viewport, Indicator, Sub

## Key Props

- **Root**: `orientation` ('horizontal'|'vertical'), `delayDuration` (200ms), `skipDelayDuration` (300ms), `value` (bindable)
- **Item**: `openOnHover` (default true)
- **Content**: `forceMount`, `onInteractOutside`, `onFocusOutside`, `onEscapeKeydown`
- **Viewport/Indicator**: `forceMount`

## Usage

Vertical: `<NavigationMenu.Root orientation="vertical">`

Submenus: Nest `NavigationMenu.Sub` inside Content

Click-to-open: `<NavigationMenu.Item openOnHover={false}>`

Force mount for SEO: `<NavigationMenu.Content forceMount>` with `data-state` for visibility control

Animations: Use `data-motion` ('from-start'|'from-end'|'to-start'|'to-end') on Content and CSS variables on Viewport