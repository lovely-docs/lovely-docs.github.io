## Transitions

Bidirectional transitions triggered when elements enter/leave DOM. Use `transition:` directive with built-in transitions (fade, fly, etc.) or custom functions.

**Local vs Global**: Local transitions (default) play only when their block changes; use `|global` modifier for parent block changes.

**Parameters**: Pass options as object: `transition:fade={{ duration: 2000 }}`

**Custom Functions**: Return object with `delay`, `duration`, `easing`, `css(t, u)`, or `tick(t, u)`. The `t` value is 0-1 (0 for out, 1 for in), `u = 1 - t`. Prefer `css` over `tick` for performance.

**Events**: `introstart`, `introend`, `outrostart`, `outroend`