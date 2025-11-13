# useId Documentation

A utility function to generate unique IDs.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

The `useId` function is a utility function that can be used to generate unique IDs. This function is used internally by all Bits UI components and is exposed for your convenience.

## Usage

```svelte
<script lang="ts">
  import { useId } from "bits-ui";
  const id = useId();
</script>
<label for={id}>Label here</label>
<input {id} />
```

[Previous Portal](/docs/utilities/portal) [Next WithElementRef](/docs/type-helpers/with-element-ref)