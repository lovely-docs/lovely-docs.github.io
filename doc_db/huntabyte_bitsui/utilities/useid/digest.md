## useId

A utility function for generating unique IDs, used internally by all Bits UI components.

### Usage

```svelte
<script lang="ts">
  import { useId } from "bits-ui";
  const id = useId();
</script>
<label for={id}>Label here</label>
<input {id} />
```

Import `useId` from "bits-ui", call it to generate a unique ID, and use it for associating labels with form elements or any other purpose requiring unique identifiers.