## Combobox

Autocomplete input and command palette with a list of suggestions. Built by composing Popover and Command components.

### Installation

Install Popover and Command components:
```
npx shadcn-svelte@latest add popover -y -o
npx shadcn-svelte@latest add command -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  const frameworks = [
    { value: "sveltekit", label: "SvelteKit" },
    { value: "next.js", label: "Next.js" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" }
  ];

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);
  
  const selectedValue = $derived(
    frameworks.find((f) => f.value === value)?.label
  );

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => triggerRef.focus());
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="w-[200px] justify-between"
        role="combobox"
        aria-expanded={open}
      >
        {selectedValue || "Select a framework..."}
        <ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each frameworks as framework}
            <Command.Item
              value={framework.value}
              onSelect={() => {
                value = framework.value;
                closeAndFocusTrigger();
              }}
            >
              <CheckIcon
                class={cn(
                  "mr-2 size-4",
                  value !== framework.value && "text-transparent"
                )}
              />
              {framework.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
```

### Examples

**Status Selector with Icons:**
```svelte
<script lang="ts">
  import CircleIcon from "@lucide/svelte/icons/circle";
  import CircleArrowUpIcon from "@lucide/svelte/icons/circle-arrow-up";
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
  import CircleHelpIcon from "@lucide/svelte/icons/circle-help";
  import CircleXIcon from "@lucide/svelte/icons/circle-x";
  import { type Component, tick } from "svelte";
  import { useId } from "bits-ui";
  import { cn } from "$lib/utils.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  type Status = {
    value: string;
    label: string;
    icon: Component;
  };

  const statuses: Status[] = [
    { value: "backlog", label: "Backlog", icon: CircleHelpIcon },
    { value: "todo", label: "Todo", icon: CircleIcon },
    { value: "in progress", label: "In Progress", icon: CircleArrowUpIcon },
    { value: "done", label: "Done", icon: CircleCheckIcon },
    { value: "canceled", label: "Canceled", icon: CircleXIcon }
  ];

  let open = $state(false);
  let value = $state("");
  const selectedStatus = $derived(statuses.find((s) => s.value === value));
  const triggerId = useId();

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => document.getElementById(triggerId)?.focus());
  }
</script>

<div class="flex items-center space-x-4">
  <p class="text-muted-foreground text-sm">Status</p>
  <Popover.Root bind:open>
    <Popover.Trigger
      id={triggerId}
      class={buttonVariants({
        variant: "outline",
        size: "sm",
        class: "w-[150px] justify-start"
      })}
    >
      {#if selectedStatus}
        {@const Icon = selectedStatus.icon}
        <Icon class="mr-2 size-4 shrink-0" />
        {selectedStatus.label}
      {:else}
        + Set status
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0" side="right" align="start">
      <Command.Root>
        <Command.Input placeholder="Change status..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group>
            {#each statuses as status (status.value)}
              <Command.Item
                value={status.value}
                onSelect={() => {
                  value = status.value;
                  closeAndFocusTrigger(triggerId);
                }}
              >
                {@const Icon = status.icon}
                <Icon
                  class={cn(
                    "mr-2 size-4",
                    status.value !== selectedStatus?.value &&
                      "text-foreground/40"
                  )}
                />
                <span>{status.label}</span>
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
```

**Dropdown Menu with Submenu:**
```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import TagsIcon from "@lucide/svelte/icons/tags";
  import TrashIcon from "@lucide/svelte/icons/trash";
  import UserIcon from "@lucide/svelte/icons/user";
  import { tick } from "svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  const labels = [
    "feature", "bug", "enhancement", "documentation", "design", "question", "maintenance"
  ];

  let open = $state(false);
  let selectedLabel = $state("feature");
  let triggerRef = $state<HTMLButtonElement>(null!);

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => triggerRef.focus());
  }
</script>

<div class="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
  <p class="text-sm font-medium leading-none">
    <span class="bg-primary text-primary-foreground mr-2 rounded-lg px-2 py-1 text-xs">
      {selectedLabel}
    </span>
    <span class="text-muted-foreground">Create a new project</span>
  </p>
  <DropdownMenu.Root bind:open>
    <DropdownMenu.Trigger bind:ref={triggerRef}>
      {#snippet child({ props })}
        <Button variant="ghost" size="sm" {...props} aria-label="Open menu">
          <EllipsisIcon />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-[200px]" align="end">
      <DropdownMenu.Group>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Item>
          <UserIcon class="mr-2 size-4" />
          Assign to...
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <CalendarIcon class="mr-2 size-4" />
          Set due date...
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <TagsIcon class="mr-2 size-4" />
            Apply label
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent class="p-0">
            <Command.Root value={selectedLabel}>
              <Command.Input autofocus placeholder="Filter label..." />
              <Command.List>
                <Command.Empty>No label found.</Command.Empty>
                <Command.Group>
                  {#each labels as label (label)}
                    <Command.Item
                      value={label}
                      onSelect={() => {
                        selectedLabel = label;
                        closeAndFocusTrigger();
                      }}
                    >
                      {label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.List>
            </Command.Root>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item class="text-red-600">
          <TrashIcon class="mr-2 size-4" />
          Delete
          <DropdownMenu.Shortcut></DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
```

**Form Integration:**
Use Form.Control to apply aria attributes and hidden input for form submission. Requires formsnap v0.5.0+.

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" }
  ] as const;
  const formSchema = z.object({
    language: z.enum(["en", "fr", "de", "es", "pt", "ru", "ja", "ko", "zh"])
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { tick } from "svelte";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { useId } from "bits-ui";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });

  const { form: formData, enhance } = form;
  let open = false;
  const triggerId = useId();

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => document.getElementById(triggerId)?.focus());
  }
</script>

<form method="POST" class="space-y-6" use:enhance>
  <Form.Field {form} name="language" class="flex flex-col">
    <Popover.Root bind:open>
      <Form.Control id={triggerId}>
        {#snippet children({ props })}
          <Form.Label>Language</Form.Label>
          <Popover.Trigger
            class={cn(
              buttonVariants({ variant: "outline" }),
              "w-[200px] justify-between",
              !$formData.language && "text-muted-foreground"
            )}
            role="combobox"
            {...props}
          >
            {languages.find((f) => f.value === $formData.language)?.label ??
              "Select language"}
            <ChevronsUpDownIcon class="opacity-50" />
          </Popover.Trigger>
          <input hidden value={$formData.language} name={props.name} />
        {/snippet}
      </Form.Control>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Input
            autofocus
            placeholder="Search language..."
            class="h-9"
          />
          <Command.Empty>No language found.</Command.Empty>
          <Command.Group value="languages">
            {#each languages as language (language.value)}
              <Command.Item
                value={language.label}
                onSelect={() => {
                  $formData.language = language.value;
                  closeAndFocusTrigger(triggerId);
                }}
              >
                {language.label}
                <CheckIcon
                  class={cn(
                    "ml-auto",
                    language.value !== $formData.language && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Form.Description>
      This is the language that will be used in the dashboard.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

**Key patterns:**
- Use `$state` for open/value, `$derived` for computed selections
- Call `closeAndFocusTrigger()` after selection to refocus trigger button for keyboard navigation
- Use `Command.Root`, `Command.Input`, `Command.List`, `Command.Group`, `Command.Item` for searchable lists
- Wrap in `Popover.Root` with `Popover.Trigger` and `Popover.Content`
- For forms, use `Form.Control` with hidden input to ensure proper submission
