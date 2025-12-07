**dynamic_void_element_content**: Void elements like `<input>` cannot have content; children are ignored.

**state_snapshot_uncloneable**: `$state.snapshot()` clones values but returns originals for uncloneable objects like DOM elements. Example: `$state.snapshot({ property: 'cloneable', window })` clones `property` but returns original `window`.