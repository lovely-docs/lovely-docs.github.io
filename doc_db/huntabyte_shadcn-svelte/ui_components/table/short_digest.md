## Table Component

Responsive table component for displaying tabular data.

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
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head class="text-right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invoices as invoice (invoice)}
      <Table.Row>
        <Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
        <Table.Cell>{invoice.paymentStatus}</Table.Cell>
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

Components: `Table.Root`, `Table.Caption`, `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Row`, `Table.Head`, `Table.Cell` (supports `colspan` and custom classes).