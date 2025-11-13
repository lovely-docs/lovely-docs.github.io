## $app/navigation API

**Navigation**: `goto(url, opts)` - programmatic navigation with options for scroll, focus, invalidation, and state.

**Lifecycle**: `beforeNavigate(callback)` and `afterNavigate(callback)` - intercept/react to navigation. `onNavigate(callback)` - runs before navigation, can return Promise or cleanup function.

**Data**: `invalidate(resource)` or `invalidateAll()` - re-run load functions. `preloadData(href)` - preload page. `preloadCode(pathname)` - import route code.

**State**: `pushState(url, state)` and `replaceState(url, state)` - manage history for shallow routing.

**Scroll**: `disableScrollHandling()` - disable automatic scroll handling.