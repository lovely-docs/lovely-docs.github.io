## $app/state

Three read-only reactive state objects:

- **navigating**: In-progress navigation with `from`, `to`, `type`, `delta` properties (null when idle)
- **page**: Current page info including `data`, `form`, `state`, `url`, `route`, `params`. Use `$derived()` for reactivity, not `$:` syntax
- **updated**: Boolean `current` value and `check()` method for app version polling