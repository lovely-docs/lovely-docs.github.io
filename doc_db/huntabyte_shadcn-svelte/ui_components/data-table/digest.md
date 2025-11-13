## Data Table Component Guide

Build custom data tables using TanStack Table v8 with Svelte 5 snippets and components.

### Installation
```bash
npm i @tanstack/table-core
npx shadcn-svelte@latest add table data-table
```

### Basic Setup
Define column types and column definitions:
```ts
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount" }
];
```

Create a reusable `<DataTable>` component using `createSvelteTable()` with `getCoreRowModel()`:
```svelte
<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  
  let { data, columns }: { columns: ColumnDef<TData, TValue>[]; data: TData[] } = $props();
  
  const table = createSvelteTable({
    get data() { return data; },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup}
        <Table.Row>
          {#each headerGroup.headers as header}
            <Table.Head>
              {#if !header.isPlaceholder}
                <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row}
        <Table.Row>
          {#each row.getVisibleCells() as cell}
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

### Cell Formatting
Use `createRawSnippet()` and `renderSnippet()` for custom cell rendering:
```ts
{
  accessorKey: "amount",
  header: () => {
    const snippet = createRawSnippet(() => ({
      render: () => `<div class="text-right">Amount</div>`,
    }));
    return renderSnippet(snippet);
  },
  cell: ({ row }) => {
    const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    const snippet = createRawSnippet<[{ amount: number }]>((getAmount) => {
      const { amount } = getAmount();
      return { render: () => `<div class="text-right">${formatter.format(amount)}</div>` };
    });
    return renderSnippet(snippet, { amount: row.original.amount });
  }
}
```

### Row Actions
Create action menus using `renderComponent()`:
```svelte
// data-table-actions.svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  let { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon">⋯</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>Copy ID</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Add to columns:
```ts
{
  id: "actions",
  cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
}
```

### Pagination
Add `PaginationState` and `getPaginationRowModel()`:
```ts
let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

const table = createSvelteTable({
  // ...
  state: { get pagination() { return pagination; } },
  onPaginationChange: (updater) => {
    pagination = typeof updater === "function" ? updater(pagination) : updater;
  },
  getPaginationRowModel: getPaginationRowModel(),
});
```

Add controls:
```svelte
<Button onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
<Button onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
```

### Sorting
Add `SortingState` and `getSortedRowModel()`:
```ts
let sorting = $state<SortingState>([]);

const table = createSvelteTable({
  // ...
  state: { get sorting() { return sorting; } },
  onSortingChange: (updater) => {
    sorting = typeof updater === "function" ? updater(sorting) : updater;
  },
  getSortedRowModel: getSortedRowModel(),
});
```

Make column sortable:
```ts
{
  accessorKey: "email",
  header: ({ column }) => renderComponent(SortButton, { onclick: column.getToggleSortingHandler() })
}
```

### Filtering
Add `ColumnFiltersState` and `getFilteredRowModel()`:
```ts
let columnFilters = $state<ColumnFiltersState>([]);

const table = createSvelteTable({
  // ...
  state: { get columnFilters() { return columnFilters; } },
  onColumnFiltersChange: (updater) => {
    columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
  },
  getFilteredRowModel: getFilteredRowModel(),
});
```

Add filter input:
```svelte
<Input
  placeholder="Filter emails..."
  value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
  oninput={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
/>
```

### Column Visibility
Add `VisibilityState`:
```ts
let columnVisibility = $state<VisibilityState>({});

const table = createSvelteTable({
  // ...
  state: { get columnVisibility() { return columnVisibility; } },
  onColumnVisibilityChange: (updater) => {
    columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
  },
});
```

Add visibility toggle:
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>{#snippet child({ props })}<Button {...props}>Columns</Button>{/snippet}</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    {#each table.getAllColumns().filter(col => col.getCanHide()) as column}
      <DropdownMenu.CheckboxItem bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}>
        {column.id}
      </DropdownMenu.CheckboxItem>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Row Selection
Add `RowSelectionState`:
```ts
let rowSelection = $state<RowSelectionState>({});

const table = createSvelteTable({
  // ...
  state: { get rowSelection() { return rowSelection; } },
  onRowSelectionChange: (updater) => {
    rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
  },
});
```

Add select column:
```ts
{
  id: "select",
  header: ({ table }) => renderComponent(Checkbox, {
    checked: table.getIsAllPageRowsSelected(),
    indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
    onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
  }),
  cell: ({ row }) => renderComponent(Checkbox, {
    checked: row.getIsSelected(),
    onCheckedChange: (value) => row.toggleSelected(!!value),
  }),
  enableSorting: false,
  enableHiding: false,
}
```

Display selected count:
```svelte
<div>{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.</div>
```