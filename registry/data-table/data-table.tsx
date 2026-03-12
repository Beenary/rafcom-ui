"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  TableOptions,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /**
   * Key used to persist column visibility to localStorage.
   * Provide a unique key per table instance.
   */
  storageKey?: string
  /**
   * Enable manual server-side sorting. When true the table will not sort data
   * internally — the consumer is responsible for re-fetching sorted data.
   * Defaults to true.
   */
  manualSorting?: boolean
  /**
   * Initial sorting state, useful when reading sort params from URL on mount.
   */
  initialSorting?: SortingState
  /**
   * Called whenever the sort state changes (only relevant when manualSorting is true).
   */
  onSortingChange?: (sorting: SortingState) => void
  /**
   * Message shown when there are no rows. Defaults to "No results."
   */
  emptyMessage?: string
  /**
   * Fixed page size for the internal pagination model.
   * When using server-side pagination, pass the slice of data for the current
   * page and set this to data.length or a large number. Defaults to 20.
   */
  pageSize?: number
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  storageKey,
  manualSorting = true,
  initialSorting = [],
  onSortingChange,
  emptyMessage = "No results.",
  pageSize = 20,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)

  // Column visibility with optional localStorage persistence
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => {
    if (!storageKey || typeof window === "undefined") return {}
    try {
      const stored = window.localStorage.getItem(storageKey)
      return stored ? (JSON.parse(stored) as VisibilityState) : {}
    } catch {
      return {}
    }
  })

  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined") return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(columnVisibility))
    } catch {
      // Silently ignore storage errors
    }
  }, [columnVisibility, storageKey])

  const handleSortingChange = React.useCallback(
    (updater: React.SetStateAction<SortingState>) => {
      setSorting((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater
        onSortingChange?.(next)
        return next
      })
    },
    [onSortingChange]
  )

  const tableConfig = {
    data: data ?? [],
    columns,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualSorting,
    state: {
      sorting,
      columnVisibility,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  } satisfies Partial<TableOptions<TData>>

  const table = useReactTable(tableConfig as TableOptions<TData>)

  return (
    <Table className={`whitespace-nowrap${className ? ` ${className}` : ""}`}>
      <TableHeader className="sticky top-0 bg-muted z-10">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="text-xs font-bold">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
