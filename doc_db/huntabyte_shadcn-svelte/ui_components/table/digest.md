## Table Component

A responsive table component for displaying tabular data.

### Installation

```bash
npx shadcn-svelte@latest add table -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import the table components:
```svelte
<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
</script>
```

Basic table structure with header, body, and footer:
```svelte
<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head class="text-right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invoices as invoice (invoice)}
      <Table.Row>
        <Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
        <Table.Cell>{invoice.paymentStatus}</Table.Cell>
        <Table.Cell>{invoice.paymentMethod}</Table.Cell>
        <Table.Cell class="text-right">{invoice.totalAmount}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colspan={3}>Total</Table.Cell>
      <Table.Cell class="text-right">$2,500.00</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

Components available:
- `Table.Root` - wrapper element
- `Table.Caption` - table caption
- `Table.Header` - header section
- `Table.Body` - body section
- `Table.Footer` - footer section
- `Table.Row` - table row
- `Table.Head` - header cell
- `Table.Cell` - data cell (supports `colspan` attribute and custom classes for styling)