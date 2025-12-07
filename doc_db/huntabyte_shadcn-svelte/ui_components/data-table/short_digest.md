## Data Table

Build tables with TanStack Table v8 using Svelte 5 snippets and components.

**Installation:**
```bash
npm i @tanstack/table-core
npx shadcn-svelte@latest add table data-table -y -o
```

**Basic DataTable component:**
```svelte
<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  type DataTableProps<TData, TValue> = { columns: ColumnDef<TData, TValue>[]; data: TData[] };
  let { data, columns }: DataTableProps<TData, TValue> = $props();

  const table = createSvelteTable({
    get data() { return data; },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head colspan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && "selected"}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

**Column definitions with formatting:**
```ts
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export type Payment = { id: string; amount: number; status: "pending" | "processing" | "success" | "failed"; email: string };

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: () => renderSnippet(createRawSnippet(() => ({ render: () => `<div class="text-right">Amount</div>` }))),
    cell: ({ row }) => {
      const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
      return renderSnippet(createRawSnippet<[{ amount: number }]>((getAmount) => {
        const { amount } = getAmount();
        return { render: () => `<div class="text-right font-medium">${formatter.format(amount)}</div>` };
      }), { amount: row.original.amount });
    },
  },
];
```

**Features:** Pagination, sorting, filtering, column visibility, row selection, row actions. Use `renderComponent()` for custom components in cells/headers, `renderSnippet()` for simple HTML. State management via `$state` with updater callbacks. Access row data via `row.original`.