## Field Component

Composable form field components for building accessible forms with labels, controls, help text, and validation states.

### Core Components

- `Field.Set`: Wrapper for a group of related fields with optional legend and description
- `Field.Group`: Container to stack multiple fields vertically
- `Field.Field`: Individual field wrapper with `orientation` prop ("vertical" default, "horizontal", or "responsive")
- `Field.Label`: Label element with `for` attribute linking to input
- `Field.Description`: Helper text displayed below the control
- `Field.Error`: Validation error message
- `Field.Legend`: Semantic heading for fieldsets
- `Field.Content`: Flex column grouping label and description
- `Field.Separator`: Visual divider between field groups
- `Field.Title`: Title within choice cards

### Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>

<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>This appears on invoices and emails.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="name">Full name</Field.Label>
      <Input id="name" placeholder="Evil Rabbit" />
      <Field.Description>This appears on invoices and emails.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" aria-invalid />
      <Field.Error>Choose another username.</Field.Error>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Input Fields

```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" type="text" placeholder="Max Leiter" />
      <Field.Description>Choose a unique username for your account.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="password">Password</Field.Label>
      <Field.Description>Must be at least 8 characters long.</Field.Description>
      <Input id="password" type="password" placeholder="********" />
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Textarea

```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="feedback">Feedback</Field.Label>
      <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
      <Field.Description>Share your thoughts about our service.</Field.Description>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Select

```svelte
<script lang="ts">
  let department = $state<string>();
  const departments = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" }
  ];
  const departmentLabel = $derived(
    departments.find((d) => d.value === department)?.label ?? "Choose department"
  );
</script>

<Field.Field>
  <Field.Label for="department">Department</Field.Label>
  <Select.Root type="single" bind:value={department}>
    <Select.Trigger id="department">{departmentLabel}</Select.Trigger>
    <Select.Content>
      {#each departments as dept (dept.value)}
        <Select.Item {...dept} />
      {/each}
    </Select.Content>
  </Select.Root>
  <Field.Description>Select your department or area of work.</Field.Description>
</Field.Field>
```

### Slider

```svelte
<script lang="ts">
  let value = $state([200, 800]);
</script>

<Field.Field>
  <Field.Label>Price Range</Field.Label>
  <Field.Description>
    Set your budget range ($<span class="font-medium">{value[0]}</span> - <span class="font-medium">{value[1]}</span>).
  </Field.Description>
  <Slider type="multiple" bind:value max={1000} min={0} step={10} class="mt-2 w-full" aria-label="Price Range" />
</Field.Field>
```

### Checkbox

```svelte
<Field.Group>
  <Field.Set>
    <Field.Legend variant="label">Show these items on the desktop</Field.Legend>
    <Field.Description>Select the items you want to show on the desktop.</Field.Description>
    <Field.Group class="gap-3">
      <Field.Field orientation="horizontal">
        <Checkbox id="hard-disks" checked />
        <Field.Label for="hard-disks" class="font-normal">Hard disks</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="external-disks" />
        <Field.Label for="external-disks" class="font-normal">External disks</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Field orientation="horizontal">
    <Checkbox id="sync-folders" checked />
    <Field.Content>
      <Field.Label for="sync-folders">Sync Desktop & Documents folders</Field.Label>
      <Field.Description>Your folders are being synced with iCloud Drive.</Field.Description>
    </Field.Content>
  </Field.Field>
</Field.Group>
```

### Radio

```svelte
<script lang="ts">
  let plan = $state("monthly");
</script>

<Field.Set>
  <Field.Label>Subscription Plan</Field.Label>
  <Field.Description>Yearly and lifetime plans offer significant savings.</Field.Description>
  <RadioGroup.Root bind:value={plan}>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="monthly" id="plan-monthly" />
      <Field.Label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="yearly" id="plan-yearly" />
      <Field.Label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</Field.Label>
    </Field.Field>
  </RadioGroup.Root>
</Field.Set>
```

### Switch

```svelte
<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable multi-factor authentication. If you do not have a two-factor device, you can use a one-time code sent to your email.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

### Choice Card (Selectable Field Groups)

Wrap Field components inside FieldLabel to create selectable field groups. Works with RadioItem, Checkbox, and Switch components.

```svelte
<script lang="ts">
  let computeEnvironment = $state("kubernetes");
</script>

<Field.Group>
  <Field.Set>
    <Field.Label for="compute-environment">Compute Environment</Field.Label>
    <Field.Description>Select the compute environment for your cluster.</Field.Description>
    <RadioGroup.Root bind:value={computeEnvironment}>
      <Field.Label for="kubernetes">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Kubernetes</Field.Title>
            <Field.Description>Run GPU workloads on a K8s configured cluster.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="kubernetes" id="kubernetes" />
        </Field.Field>
      </Field.Label>
      <Field.Label for="vm">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Virtual Machine</Field.Title>
            <Field.Description>Access a VM configured cluster to run GPU workloads.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="vm" id="vm" />
        </Field.Field>
      </Field.Label>
    </RadioGroup.Root>
  </Field.Set>
</Field.Group>
```

### Field Groups with Separators

```svelte
<Field.Group>
  <Field.Set>
    <Field.Label>Responses</Field.Label>
    <Field.Description>Get notified when ChatGPT responds to requests that take time.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push" checked disabled />
        <Field.Label for="push" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Set>
    <Field.Label>Tasks</Field.Label>
    <Field.Description>Get notified when tasks you've created have updates.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push-tasks" />
        <Field.Label for="push-tasks" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="email-tasks" />
        <Field.Label for="email-tasks" class="font-normal">Email notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</Field.Group>
```

### Responsive Layout

- **Vertical fields** (default): Stacks label, control, and helper text vertically—ideal for mobile-first layouts
- **Horizontal fields**: Set `orientation="horizontal"` on Field to align label and control side-by-side. Pair with FieldContent to keep descriptions aligned
- **Responsive fields**: Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on FieldGroup to switch orientations at specific breakpoints

```svelte
<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>Fill in your profile information.</Field.Description>
  <Field.Separator />
  <Field.Group>
    <Field.Field orientation="responsive">
      <Field.Content>
        <Field.Label for="name">Name</Field.Label>
        <Field.Description>Provide your full name for identification</Field.Description>
      </Field.Content>
      <Input id="name" placeholder="Evil Rabbit" required />
    </Field.Field>
    <Field.Separator />
    <Field.Field orientation="responsive">
      <Field.Content>
        <Field.Label for="message">Message</Field.Label>
        <Field.Description>Keep it short, preferably under 100 characters.</Field.Description>
      </Field.Content>
      <Textarea id="message" placeholder="Hello, world!" required class="min-h-[100px] resize-none sm:min-w-[300px]" />
    </Field.Field>
    <Field.Separator />
    <Field.Field orientation="responsive">
      <Button type="submit">Submit</Button>
      <Button type="button" variant="outline">Cancel</Button>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Validation and Errors

Add `data-invalid` to Field to switch the entire block into an error state. Add `aria-invalid` on the input itself for assistive technologies. Render FieldError immediately after the control or inside FieldContent to keep error messages aligned with the field.

```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

### Accessibility

- FieldSet and FieldLegend keep related controls grouped for keyboard and assistive tech users
- Field outputs `role="group"` so nested controls inherit labeling from FieldLabel and FieldLegend when combined
- Apply FieldSeparator sparingly to ensure screen readers encounter clear section boundaries