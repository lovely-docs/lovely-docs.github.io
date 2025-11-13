## Error & Warning Reference

Complete reference for Svelte compiler and runtime errors and warnings across client, server, and shared contexts.

**Key Client Errors**: Reactivity violations (`state_unsafe_mutation`, `effect_update_depth_exceeded`), binding issues (`bind_not_bindable`), lifecycle restrictions (`effect_orphan`, `set_context_after_init`), component API changes (`component_api_invalid_new`)

**Key Client Warnings**: Reactivity tracking (`await_reactivity_loss`), state proxies (`state_proxy_equality_mismatch`, `console_log_state`), hydration mismatches

**Key Compiler Errors**: Animation/binding/block structure violations, CSS scoping issues, rune usage errors, snippet/state declaration problems, svelte meta element restrictions

**Key Compiler Warnings**: Accessibility (a11y_*) violations, code quality issues (unused exports, non-reactive updates, component naming), deprecated options and patterns

**Server Errors**: Async rendering restrictions, deprecated properties, lifecycle unavailability

**Shared Errors**: Snippet rendering requirements, lifecycle scope restrictions, context/store shape requirements