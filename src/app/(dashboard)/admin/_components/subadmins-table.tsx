'use client'

import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Inbox } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SubAdminDto } from '@/hooks/use-subadmins'
import { columns } from './subadmin-columns'

interface SubadminsTableProps {
  data: SubAdminDto[]
  rowSelection: Record<string, boolean>
  onRowSelectionChange: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >
}

export function SubadminsTable({
  data,
  rowSelection,
  onRowSelectionChange,
}: SubadminsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange,
    state: {
      rowSelection,
    },
  })

  return (
    <div className="max-h-full min-h-112.5 overflow-y-auto">
      <Table>
        <TableHeader className="dark:bg-muted/50 sticky top-0 z-10 bg-slate-50 shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="dark:bg-muted dark:text-foreground h-12 bg-slate-100 px-5 text-center font-medium text-slate-700"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="group h-16 transition-colors hover:bg-slate-50 dark:hover:bg-black/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-5 text-center align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-[300px] p-8">
                <div className="flex flex-col items-center justify-center gap-4 text-center text-slate-400 dark:text-slate-500">
                  <Inbox className="h-12 w-12 text-slate-200 dark:text-slate-700" />
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                    لا توجد مشرفين متاحين
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
