## Data Table with TanStack Table v8

Install: `npm i @tanstack/table-core && npx shadcn-svelte@latest add table data-table`

Create reusable `<DataTable>` component with `createSvelteTable()` and `getCoreRowModel()`. Use `FlexRender` to render headers and cells from column definitions.

Format cells with `createRawSnippet()` and `renderSnippet()`. Add row actions with `renderComponent()`.

Enable features by adding state and row models:
- **Pagination**: `PaginationState` + `getPaginationRowModel()` + Previous/Next buttons
- **Sorting**: `SortingState` + `getSortedRowModel()` + `column.getToggleSortingHandler()`
- **Filtering**: `ColumnFiltersState` + `getFilteredRowModel()` + `table.getColumn("email")?.setFilterValue()`
- **Visibility**: `VisibilityState` + dropdown to toggle `column.toggleVisibility()`
- **Row Selection**: `RowSelectionState` + select column with checkboxes + `table.getFilteredSelectedRowModel()`