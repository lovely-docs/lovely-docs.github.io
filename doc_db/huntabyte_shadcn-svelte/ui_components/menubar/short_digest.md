## Menubar

Desktop-style persistent menu component.

### Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  let checked = $state(false);
  let selected = $state("option1");
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New Tab <Menubar.Shortcut>T</Menubar.Shortcut></Menubar.Item>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
      <Menubar.CheckboxItem bind:checked={checked}>Option</Menubar.CheckboxItem>
      <Menubar.RadioGroup bind:value={selected}>
        <Menubar.RadioItem value="option1">Option 1</Menubar.RadioItem>
      </Menubar.RadioGroup>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

Key components: Root, Menu, Trigger, Content, Item, Shortcut, Separator, Sub/SubTrigger/SubContent, CheckboxItem, RadioGroup/RadioItem. Use `inset` prop on Item for alignment.