## BitsConfig
Global context provider for default props (portal target, locale) with inheritance and override support. Resolution order: direct prop → nearest parent BitsConfig → inherited → built-in default.

## IsUsingKeyboard
Tracks active keyboard usage with global shared state.

## mergeProps
Merges props with special handling: event handlers chain with preventDefault support, functions chain without cancellation, classes merge via clsx, styles merge with later overrides.

## Portal
Renders children in a portal (default: body) with customizable target and disable option.

## useId
Generates unique IDs for form elements and components.