# IsUsingKeyboard Documentation

A utility to track whether the user is actively using the keyboard or not.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

## Overview

`IsUsingKeyboard` is a utility component that tracks whether the user is actively using the keyboard or not. This component is used internally by Bits UI components to provide keyboard accessibility features.

It provides global state that is shared across all instances of the class to prevent duplicate event listener registration.

## Usage

```svelte
<script lang="ts">
  import { IsUsingKeyboard } from "bits-ui";
  const isUsingKeyboard = new IsUsingKeyboard();
  const shouldShowMenu = $derived(isUsingKeyboard.current);
</script>
```

[Previous BitsConfig](/docs/utilities/bits-config) [Next mergeProps](/docs/utilities/merge-props)