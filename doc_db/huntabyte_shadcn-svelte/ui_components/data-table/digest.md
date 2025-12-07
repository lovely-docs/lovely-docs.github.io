## Data Table

Build powerful tables and datagrids using TanStack Table v8 with Svelte 5 snippets and components.

### Installation

```bash
npm i @tanstack/table-core
npx shadcn-svelte@latest add table data-table -y -o
```

The `-y` flag skips confirmation prompts and `-o` overwrites existing files.

### Basic Setup

Define your data type and column definitions:

```ts
// columns.ts
import type { ColumnDef } from "@tanstack/table-core";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount" },
];
```

Create a reusable DataTable component:

```svelte
<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

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

### Cell Formatting

Use `createRawSnippet` and `renderSnippet` for custom cell rendering:

```ts
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export const columns: ColumnDef<Payment>[] = [
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
        return { render: () => `<div class="text-right font-medium">${formatter.format(amount)}</div>` };
      });
      return renderSnippet(snippet, { amount: row.original.amount });
    },
  },
];
```

### Row Actions

Create an actions dropdown component:

```svelte
// data-table-actions.svelte
<script lang="ts">
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
        <span class="sr-only">Open menu</span>
        <EllipsisIcon />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>Copy payment ID</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View customer</DropdownMenu.Item>
    <DropdownMenu.Item>View payment details</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Add to columns using `renderComponent`:

```ts
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "actions",
    cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id }),
  },
];
```

### Pagination

```ts
import { type PaginationState, getPaginationRowModel } from "@tanstack/table-core";

let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

const table = createSvelteTable({
  // ... other config
  state: { get pagination() { return pagination; } },
  onPaginationChange: (updater) => {
    pagination = typeof updater === "function" ? updater(pagination) : updater;
  },
  getPaginationRowModel: getPaginationRowModel(),
});
```

Add pagination controls:

```svelte
<div class="flex items-center justify-end space-x-2 py-4">
  <Button variant="outline" size="sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
    Previous
  </Button>
  <Button variant="outline" size="sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
    Next
  </Button>
</div>
```

### Sorting

Create a sortable header button component:

```svelte
// data-table-email-button.svelte
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
  import { Button } from "$lib/components/ui/button/index.js";

  let { variant = "ghost", ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button {variant} {...restProps}>
  Email
  <ArrowUpDownIcon class="ml-2" />
</Button>
```

Enable sorting in DataTable:

```ts
import { type SortingState, getSortedRowModel } from "@tanstack/table-core";

let sorting = $state<SortingState>([]);

const table = createSvelteTable({
  // ... other config
  state: { get sorting() { return sorting; } },
  onSortingChange: (updater) => {
    sorting = typeof updater === "function" ? updater(sorting) : updater;
  },
  getSortedRowModel: getSortedRowModel(),
});
```

Update column definition:

```ts
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableEmailButton from "./data-table-email-button.svelte";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => renderComponent(DataTableEmailButton, { onclick: column.getToggleSortingHandler() }),
  },
];
```

### Filtering

```ts
import { type ColumnFiltersState, getFilteredRowModel } from "@tanstack/table-core";
import { Input } from "$lib/components/ui/input/index.js";

let columnFilters = $state<ColumnFiltersState>([]);

const table = createSvelteTable({
  // ... other config
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
  class="max-w-sm"
/>
```

### Column Visibility

```ts
import { type VisibilityState } from "@tanstack/table-core";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

let columnVisibility = $state<VisibilityState>({});

const table = createSvelteTable({
  // ... other config
  state: { get columnVisibility() { return columnVisibility; } },
  onColumnVisibilityChange: (updater) => {
    columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
  },
});
```

Add visibility toggle dropdown:

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="ml-auto">Columns</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    {#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
      <DropdownMenu.CheckboxItem
        class="capitalize"
        bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
      >
        {column.id}
      </DropdownMenu.CheckboxItem>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Row Selection

Create checkbox component:

```svelte
// data-table-checkbox.svelte
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  let { checked = false, onCheckedChange = (v) => (checked = v), ...restProps }: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox bind:checked={() => checked, onCheckedChange} {...restProps} />
```

Enable row selection in DataTable:

```ts
import { type RowSelectionState } from "@tanstack/table-core";

let rowSelection = $state<RowSelectionState>({});

const table = createSvelteTable({
  // ... other config
  state: { get rowSelection() { return rowSelection; } },
  onRowSelectionChange: (updater) => {
    rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
  },
});
```

Add select column:

```ts
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableCheckbox from "./data-table-checkbox.svelte";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
];
```

Display selected row count:

```svelte
<div class="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

### Project Structure

```
routes/payments/
  columns.ts                    # Column definitions
  data-table.svelte             # Main DataTable component
  data-table-actions.svelte     # Row actions dropdown
  data-table-checkbox.svelte    # Row selection checkbox
  data-table-email-button.svelte # Sortable email header
  +page.svelte                  # Page component
```

Extract DataTable into a reusable component at `components/ui/data-table.svelte` if used in multiple places. See Tasks example for advanced patterns.