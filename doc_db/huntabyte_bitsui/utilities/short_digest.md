**BitsConfig:** Global context provider for default props (defaultPortalTo, defaultLocale) with scoped inheritance and component-level overrides. Resolution order: direct prop → nearest parent BitsConfig → inherited parent → built-in default.

**IsUsingKeyboard:** Tracks keyboard activity via global shared state; instantiate and read `.current` property for boolean keyboard usage status.

**mergeProps:** Merges props objects with event handler chaining (preventDefault stops chain), function chaining, clsx class merging, and style object/string merging with override semantics.

**Portal:** Renders children to specified DOM location (body by default) via `to` prop; disable with `disabled` prop; configure default target via BitsConfig's `defaultPortalTo`.

**useId:** Generates unique IDs for element association; used internally by all components, exposed for public use.