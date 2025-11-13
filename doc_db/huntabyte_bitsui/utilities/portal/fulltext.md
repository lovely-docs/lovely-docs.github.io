# Portal Documentation

A component that renders its children in a portal, preventing layout issues in complex UI structures.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

## Overview

The Portal component is a utility component that renders its children in a portal, preventing layout issues in complex UI structures. This component is used for the various Bits UI component that have a `Portal` sub-component.

## Usage

### Default behavior

By default, the `Portal` component will render its children in the `body` element.

```svelte
<script lang="ts">
  import { Portal } from "bits-ui";
</script>
<Portal>
  <div>This content will be portalled to the body</div>
</Portal>
```

### Custom target

You can use the `to` prop to specify a custom target element or selector to render the content to.

```svelte
<script lang="ts">
  import { Portal } from "bits-ui";
</script>
<div id="custom-target"></div>
<div>
  <Portal to="#custom-target">
    <div>This content will be portalled to the #custom-target element</div>
  </Portal>
</div>
```

### Disable

You can use the `disabled` prop to disable the portal behavior.

```svelte
<script lang="ts">
  import { Portal } from "bits-ui";
</script>
<Portal disabled>
  <div>This content will not be portalled</div>
</Portal>
```

### Overriding the default target

The default target can modified using the `defaultPortalTo` prop of the [`BitsConfig`](/docs/utilities/bits-config) component.

This will change the default target for all `Portal` components within its scope.

Expand Code

```svelte
<script lang="ts">
  import { Portal, BitsConfig } from "bits-ui";
  let target: HTMLElement | undefined = $state();
</script>
<BitsConfig defaultPortalTo={target}>
  <div bind:this={target} class="bg-background flex rounded-md border p-2">
    <section class="flex size-12 items-center justify-center bg-blue-200">
      <div class="size-8 bg-blue-400"></div>
      <Portal>
        <!-- This content will be lifted out of the section and made a child of {target} -->
        <div class="size-12 bg-blue-600"></div>
      </Portal>
    </section>
  </div>
</BitsConfig>
```

## API Reference

### Portal

Renders the children to a different location in the DOM.

| Property   | Type                        | Description                                                                                                                      | Details |
| ---------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `to`       | `union` - Element \| string | Where to render the content when it is open. Defaults to the body.`Default: document.body`                                       |         |
| `disabled` | `boolean`                   | Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.`Default: false` |         |
| `children` | `Snippet`                   | The children content to render.`Default:  —— undefined`                                                                          |         |

[Previous mergeProps](/docs/utilities/merge-props) [Next useId](/docs/utilities/use-id)