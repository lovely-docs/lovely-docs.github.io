Svelte emits compile-time warnings for potential mistakes like inaccessible markup.

Disable false positive warnings using `<!-- svelte-ignore <code> -->` comments placed above the problematic line:

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />
```

Multiple rules can be ignored in a single comment (comma-separated) with optional explanatory notes:

```svelte
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) -->
<div onclick>...</div>
```