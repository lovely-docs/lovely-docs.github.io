## Table Component

Responsive table component with `Table.Root`, `Table.Header`, `Table.Body`, `Table.Footer`, `Table.Row`, `Table.Head`, and `Table.Cell` subcomponents.

```svelte
import * as Table from "$lib/components/ui/table/index.js";

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Invoice</Table.Head>
      <Table.Head class="text-right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invoices as invoice}
      <Table.Row>
        <Table.Cell>{invoice.invoice}</Table.Cell>
        <Table.Cell class="text-right">{invoice.totalAmount}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colspan={2}>Total</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```