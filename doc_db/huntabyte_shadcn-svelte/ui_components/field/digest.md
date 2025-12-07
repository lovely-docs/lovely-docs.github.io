# Field Component

Composable form field components for building accessible forms with labels, controls, help text, and validation states.

## Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

## Core Components

- `Field` - wrapper for a single field with `role="group"`
- `FieldSet` - semantic grouping with `<fieldset>`
- `FieldLegend` - legend for fieldsets
- `FieldGroup` - flex column container for related fields
- `FieldLabel` - label element, can wrap fields for choice cards
- `FieldDescription` - helper text
- `FieldError` - validation error message
- `FieldContent` - flex column grouping label and description
- `FieldSeparator` - divider between field groups
- `FieldTitle` - title for choice cards

## Orientation

- Default (vertical): stacks label, control, helper text
- `orientation="horizontal"`: aligns label and control side-by-side with `FieldContent` for aligned descriptions
- `orientation="responsive"`: automatic column layouts with container queries using `@container/field-group`

## Examples

**Input fields:**
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

**Textarea:**
```svelte
<Field.Field>
  <Field.Label for="feedback">Feedback</Field.Label>
  <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
  <Field.Description>Share your thoughts about our service.</Field.Description>
</Field.Field>
```

**Select:**
```svelte
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

**Slider:**
```svelte
<Field.Field>
  <Field.Label>Price Range</Field.Label>
  <Field.Description>Set your budget range (${value[0]} - ${value[1]}).</Field.Description>
  <Slider type="multiple" bind:value max={1000} min={0} step={10} class="mt-2 w-full" />
</Field.Field>
```

**Fieldset with legend:**
```svelte
<Field.Set>
  <Field.Legend>Address Information</Field.Legend>
  <Field.Description>We need your address to deliver your order.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="street">Street Address</Field.Label>
      <Input id="street" type="text" placeholder="123 Main St" />
    </Field.Field>
    <div class="grid grid-cols-2 gap-4">
      <Field.Field>
        <Field.Label for="city">City</Field.Label>
        <Input id="city" type="text" placeholder="New York" />
      </Field.Field>
      <Field.Field>
        <Field.Label for="zip">Postal Code</Field.Label>
        <Input id="zip" type="text" placeholder="90502" />
      </Field.Field>
    </div>
  </Field.Group>
</Field.Set>
```

**Checkbox group:**
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

**Radio group:**
```svelte
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

**Switch:**
```svelte
<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable multi-factor authentication for added security.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

**Choice card (selectable field groups):**
```svelte
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

**Responsive layout:**
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
  </Field.Group>
</Field.Set>
```

## Validation

Add `data-invalid` to `Field` to switch into error state. Add `aria-invalid` on the input for assistive technologies. Render `FieldError` after the control or inside `FieldContent`:

```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

## Accessibility

- `FieldSet` and `FieldLegend` group related controls for keyboard and assistive tech users
- `Field` outputs `role="group"` so nested controls inherit labeling from `FieldLabel` and `FieldLegend`
- Use `FieldSeparator` sparingly to ensure screen readers encounter clear section boundaries
