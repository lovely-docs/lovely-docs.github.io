## Table Component

Responsive table with structured sections.

### Installation
```bash
npx shadcn-svelte@latest add table -y -o
```

### Usage
```svelte
<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
</script>

<Table.Root>
  <Table.Caption>Caption text</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Column 1</Table.Head>
      <Table.Head class="text-right">Column 2</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Data 1</Table.Cell>
      <Table.Cell class="text-right">Data 2</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colspan={2}>Total</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

Components: `Root`, `Caption`, `Header`, `Body`, `Footer`, `Row`, `Head`, `Cell` (supports `colspan` and custom classes)