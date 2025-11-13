# PIN Input Documentation

Enables users to input a sequence of one-character inputs.

This is a documentation section that potentially contains examples, demos, and other useful information related to a specific part of Bits UI. When helping users with this documentation, you can ignore the classnames applied to the demos unless they are relevant to the user's issue.

Copy Page

```svelte
<script lang="ts">
  import {
    PinInput,
    REGEXP_ONLY_DIGITS,
    type PinInputRootSnippetProps
  } from "bits-ui";
  import { toast } from "svelte-sonner";
  import cn from "clsx";
  let value = $state("");
  type CellProps = PinInputRootSnippetProps["cells"][0];
  function onComplete() {
    toast.success(`Completed with value ${value}`);
    value = "";
  }
</script>
<PinInput.Root
  bind:value
  class="group/pininput text-foreground has-disabled:opacity-30 flex items-center"
  maxlength={6}
  {onComplete}
  pattern={REGEXP_ONLY_DIGITS}
>
  {#snippet children({ cells })}
    <div class="flex">
      {#each cells.slice(0, 3) as cell, i (i)}
        {@render Cell(cell)}
      {/each}
    </div>
    <div class="flex w-10 items-center justify-center">
      <div class="bg-border h-1 w-3 rounded-full"></div>
    </div>
    <div class="flex">
      {#each cells.slice(3, 6) as cell, i (i)}
        {@render Cell(cell)}
      {/each}
    </div>
  {/snippet}
</PinInput.Root>
{#snippet Cell(cell: CellProps)}
  <PinInput.Cell
    {cell}
    class={cn(
      // Custom class to override global focus styles
      "focus-override",
      "relative h-14 w-10 text-[2rem]",
      "flex items-center justify-center",
      "transition-all duration-75",
      "border-foreground/20 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
      "text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40",
      "outline-0",
      "data-active:outline-1 data-active:outline-white"
    )}
  >
    {#if cell.char !== null}
      <div>
        {cell.char}
      </div>
    {/if}
    {#if cell.hasFakeCaret}
      <div
        class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div class="h-8 w-px bg-white"></div>
      </div>
    {/if}
  </PinInput.Cell>
{/snippet}
```

## Overview

The PIN Input component provides a customizable solution for One-Time Password (OTP), Two-Factor Authentication (2FA), or Multi-Factor Authentication (MFA) input fields. Due to the lack of a native HTML element for these purposes, developers often resort to either basic input fields or custom implementations. This component offers a robust, accessible, and flexible alternative.

##### Credits

This component is derived from and would not have been possible without the work done by [Guilherme Rodz](https://x.com/guilhermerodz) with [Input OTP](https://github.com/guilhermerodz/input-otp).

## Key Features

- **Invisible Input Technique**: Utilizes an invisible input element for seamless integration with form submissions and browser autofill functionality.
- **Customizable Appearance**: Allows for custom designs while maintaining core functionality.
- **Accessibility**: Ensures keyboard navigation and screen reader compatibility.
- **Flexible Configuration**: Supports various PIN lengths and input types (numeric, alphanumeric).

## Architecture

1. **Root Container**: A relatively positioned root element that encapsulates the entire component.
2. **Invisible Input**: A hidden input field that manages the actual value and interacts with the browser's built-in features.
3. **Visual Cells**: Customizable elements representing each character of the PIN, rendered as siblings to the invisible input.

This structure allows for a seamless user experience while providing developers with full control over the visual representation.

## Structure

```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
</script>
<PinInput.Root maxlength={6}>
  {#snippet children({ cells })}
    {#each cells as cell}
      <PinInput.Cell {cell} />
    {/each}
  {/snippet}
</PinInput.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
  let myValue = $state("");
</script>
<button onclick={() => (myValue = "123456")}> Set value to 123456 </button>
<PinInput.Root bind:value={myValue}>
  <!-- -->
</PinInput.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
  let myValue = $state("");
  function getValue() {
    return myValue;
  }
  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>
<PinInput.Root bind:value={getValue, setValue}>
  <!-- ... -->
</PinInput.Root>
```

## Paste Transformation

The `pasteTransformer` prop allows you to sanitize/transform pasted text. This can be useful for cleaning up pasted text, like removing hyphens or other characters that should not make it into the input. This function should return the sanitized text, which will be used as the new value of the input.

```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
</script>
<PinInput.Root pasteTransformer={(text) => text.replace(/-/g, "")}>
  <!-- ... -->
</PinInput.Root>
```

## HTML Forms

The `PinInput.Root` component is designed to work seamlessly with HTML forms. Simply pass the `name` prop to the `PinInput.Root` component and the input will be submitted with the form.

### Submit On Complete

To submit the form when the input is complete, you can use the `onComplete` prop.

```svelte
<script lang="ts">
  import { PinInput } from "bits-ui";
  let form = $state<HTMLFormElement>(null!);
</script>
<form method="POST" bind:this={form}>
  <PinInput.Root name="mfaCode" onComplete={() => form.submit()}>
    <!-- ... -->
  </PinInput.Root>
</form>
```

## Patterns

You can use the `pattern` prop to restrict the characters that can be entered or pasted into the input.

##### Note!

Client-side validation cannot replace server-side validation. Use this in addition to server-side validation for an improved user experience.

Bits UI exports a few common patterns that you can import and use in your application.

- `REGEXP_ONLY_DIGITS` - Only allow digits to be entered.
- `REGEXP_ONLY_CHARS` - Only allow characters to be entered.
- `REGEXP_ONLY_DIGITS_AND_CHARS` - Only allow digits and characters to be entered.

```svelte
<script lang="ts">
  import { PinInput, REGEXP_ONLY_DIGITS } from "bits-ui";
</script>
<PinInput.Root pattern={REGEXP_ONLY_DIGITS}>
  <!-- ... -->
</PinInput.Root>
```

## API Reference

### PINInput.Root

The pin input container component.

| Property                      | Type                                                                                                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                 | Details |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `value` $bindable             | `string`                                                                                                                                                                                                                                                                                                                              | The value of the input.`Default:  —— undefined`                                                                                                                                                                                                                                                             |         |
| `onValueChange`               | `function` - (value: string) => void                                                                                                                                                                                                                                                                                                  | A callback function that is called when the value of the input changes.`Default:  —— undefined`                                                                                                                                                                                                             |         |
| `disabled`                    | `boolean`                                                                                                                                                                                                                                                                                                                             | Whether or not the pin input is disabled.`Default: false`                                                                                                                                                                                                                                                   |         |
| `textalign`                   | `enum` - 'left' \| 'center' \| 'right'                                                                                                                                                                                                                                                                                                | Where is the text located within the input. Affects click-holding or long-press behavior`Default: 'left'`                                                                                                                                                                                                   |         |
| `maxlength`                   | `number`                                                                                                                                                                                                                                                                                                                              | The maximum length of the pin input.`Default: 6`                                                                                                                                                                                                                                                            |         |
| `onComplete`                  | `function` - (...args: any\[]) => void                                                                                                                                                                                                                                                                                                | A callback function that is called when the input is completely filled.`Default:  —— undefined`                                                                                                                                                                                                             |         |
| `pasteTransformer`            | `function` - (text: string) => string                                                                                                                                                                                                                                                                                                 | A callback function that is called when the user pastes text into the input. It receives the pasted text as an argument and should return the sanitized text. Useful for cleaning up pasted text, like removing hyphens or other characters that should not make it into the input.`Default:  —— undefined` |         |
| `inputId`                     | `string`                                                                                                                                                                                                                                                                                                                              | Optionally provide an ID to apply to the hidden input element.`Default:  —— undefined`                                                                                                                                                                                                                      |         |
| `pushPasswordManagerStrategy` | `enum` - 'increase-width' \| 'none'                                                                                                                                                                                                                                                                                                   | Enabled by default, it's an optional strategy for detecting Password Managers in the page and then shifting their badges to the right side, outside the input.`Default:  —— undefined`                                                                                                                      |         |
| `ref` $bindable               | `HTMLDivElement`                                                                                                                                                                                                                                                                                                                      | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                                                                                                                                                                                           |         |
| `children`                    | `Snippet` - type PinInputCell = { /\*\* The character displayed in the cell. \*/ char: string \| null \| undefined; /\*\* Whether the cell is active. \*/ isActive: boolean; /\*\* Whether the cell has a fake caret. \*/ hasFakeCaret: boolean; }; type SnippetProps = { cells: PinInputCell\[]; };                                  | The children content to render.`Default:  —— undefined`                                                                                                                                                                                                                                                     |         |
| `child`                       | `Snippet` - type PinInputCell = { /\*\* The character displayed in the cell. \*/ char: string \| null \| undefined; /\*\* Whether the cell is active. \*/ isActive: boolean; /\*\* Whether the cell has a fake caret. \*/ hasFakeCaret: boolean; }; type SnippetProps = { cells: PinInputCell\[]; props: Record\<string, unknown>; }; | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                                                                                                                               |         |

| Data Attribute        | Value | Description                  | Details |
| --------------------- | ----- | ---------------------------- | ------- |
| `data-pin-input-root` | `''`  | Present on the root element. |         |

### PINInput.Cell

A single cell of the pin input.

| Property        | Type                                                                                                                                                                                                                                      | Description                                                                                                                                   | Details |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `cell`          | `object` - type Cell = { /\*\* The character displayed in the cell. \*/ char: string \| null \| undefined; /\*\* Whether the cell is active. \*/ isActive: boolean; /\*\* Whether the cell has a fake caret. \*/ hasFakeCaret: boolean; } | The cell object provided by the `cells` snippet prop from the `PinInput.Root` component.`Default:  —— undefined`                              |         |
| `ref` $bindable | `HTMLDivElement`                                                                                                                                                                                                                          | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default: null`                             |         |
| `children`      | `Snippet`                                                                                                                                                                                                                                 | The children content to render.`Default:  —— undefined`                                                                                       |         |
| `child`         | `Snippet` - type SnippetProps = { props: Record\<string, unknown>; };                                                                                                                                                                     | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |         |

| Data Attribute        | Value | Description                        | Details |
| --------------------- | ----- | ---------------------------------- | ------- |
| `data-active`         | `''`  | Present when the cell is active.   |         |
| `data-inactive`       | `''`  | Present when the cell is inactive. |         |
| `data-pin-input-cell` | `''`  | Present on the cell element.       |         |

[Previous Pagination](/docs/components/pagination) [Next Popover](/docs/components/popover)