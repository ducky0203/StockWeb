import { useRef, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ColDescriptor } from '@/utils/tableColumns'

// Compact, Excel-like row so we can fit as many rows on screen as possible.
const ROW_HEIGHT = 26

interface VirtualDataTableProps {
  columns: ColDescriptor[]
  data: Record<string, unknown>[]
  loading?: boolean
  emptyText?: string
  filterable?: boolean
  /** Freeze the first column (Excel-style frozen pane) while scrolling sideways. */
  freezeFirstColumn?: boolean
}

function toColumnDef(col: ColDescriptor): ColumnDef<Record<string, unknown>> {
  return {
    id: col.field,
    accessorKey: col.field,
    header: col.title,
    size: col.minWidth,
    minSize: 56,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const value = getValue()
      const text = col.format ? col.format(value) : value == null ? '' : String(value)
      if (col.type === 'color') {
        const hex = typeof value === 'string' && value.startsWith('#') ? value : null
        return (
          <span className="inline-flex items-center gap-1.5">
            {hex && (
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-sm border border-gray-300"
                style={{ backgroundColor: hex }}
              />
            )}
            {text}
          </span>
        )
      }
      return (
        <span className={col.align === 'right' ? 'block w-full text-right tabular-nums' : 'block truncate'}>
          {text}
        </span>
      )
    },
  }
}

const SORT_ICON: Record<string, string> = { asc: '▲', desc: '▼' }

export default function VirtualDataTable({
  columns,
  data,
  loading = false,
  emptyText = 'Không có dữ liệu',
  filterable = false,
  freezeFirstColumn = true,
}: VirtualDataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const tableColumns = useMemo(() => columns.map(toColumnDef), [columns])

  const table = useReactTable({
    data,
    columns: tableColumns,
    columnResizeMode: 'onChange',
    state: { columnFilters, sorting },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 16,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const totalWidth = table.getTotalSize()

  if (loading) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Đang tải…</p>
  }

  if (!data.length) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">{emptyText}</p>
  }

  const headerGroup = table.getHeaderGroups()[0]

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-300 bg-white">
      <div ref={parentRef} className="min-h-0 flex-1 overflow-auto">
        <div style={{ minWidth: totalWidth }}>
          {/* Header */}
          <div className="sticky top-0 z-20 bg-gray-100">
            {/* Title row */}
            <div className="flex border-b border-gray-300 text-[11px] font-semibold text-gray-600">
              {headerGroup?.headers.map((header, idx) => {
                const sticky = freezeFirstColumn && idx === 0
                const sorted = header.column.getIsSorted() as string
                return (
                  <div
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={[
                      'group relative flex shrink-0 cursor-pointer select-none items-center justify-between gap-1 border-r border-gray-300 bg-gray-100 px-2 py-1 hover:bg-gray-200',
                      sticky ? 'sticky left-0 z-30' : '',
                    ].join(' ')}
                    style={{ width: header.getSize() }}
                    title={String(header.column.columnDef.header ?? '')}
                  >
                    <span className="truncate">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <span className="shrink-0 text-[9px] text-blue-500">{SORT_ICON[sorted] ?? ''}</span>

                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        header.getResizeHandler()(e)
                      }}
                      onTouchStart={header.getResizeHandler()}
                      onClick={(e) => e.stopPropagation()}
                      className={[
                        'absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-transparent transition-colors hover:bg-blue-400',
                        header.column.getIsResizing() ? 'bg-blue-500' : '',
                      ].join(' ')}
                    />
                  </div>
                )
              })}
            </div>

            {/* Filter row */}
            {filterable && (
              <div className="flex border-b border-gray-300">
                {headerGroup?.headers.map((header, idx) => {
                  const sticky = freezeFirstColumn && idx === 0
                  return (
                    <div
                      key={header.id}
                      className={[
                        'shrink-0 border-r border-gray-300 bg-gray-100 px-1 py-0.5',
                        sticky ? 'sticky left-0 z-30' : '',
                      ].join(' ')}
                      style={{ width: header.getSize() }}
                    >
                      <input
                        type="text"
                        value={(header.column.getFilterValue() as string) ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        placeholder="Lọc…"
                        className="h-6 w-full rounded-sm border border-gray-200 bg-white px-1 text-[11px] text-gray-700 placeholder-gray-300 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Virtual rows */}
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              const zebra = virtualRow.index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
              return (
                <div
                  key={row.id}
                  className={`group absolute left-0 flex w-full border-b border-gray-200 text-xs text-gray-700 ${zebra} hover:bg-blue-50`}
                  style={{ height: ROW_HEIGHT, transform: `translateY(${virtualRow.start}px)` }}
                >
                  {row.getVisibleCells().map((cell, idx) => {
                    const sticky = freezeFirstColumn && idx === 0
                    return (
                      <div
                        key={cell.id}
                        className={[
                          'flex shrink-0 items-center overflow-hidden border-r border-gray-200 px-2',
                          sticky ? `sticky left-0 z-10 ${zebra} group-hover:bg-blue-50` : '',
                        ].join(' ')}
                        style={{ width: cell.column.getSize() }}
                        title={String(cell.getValue() ?? '')}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Status bar (Excel-like) */}
      <div className="flex shrink-0 items-center justify-between border-t border-gray-300 bg-gray-50 px-3 py-1 text-[11px] text-gray-500">
        <span>
          {rows.length.toLocaleString('vi-VN')} dòng
          {rows.length !== data.length && ` (lọc từ ${data.length.toLocaleString('vi-VN')})`}
        </span>
        <span>{columns.length} cột</span>
      </div>
    </div>
  )
}
