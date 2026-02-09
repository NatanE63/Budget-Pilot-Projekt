import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui-table'; // We will define this next
import { Button } from './ui';

// Generic Definition
interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({ data, columns, actions }: DataTableProps<T>) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead key={idx}>{col.header}</TableHead>
            ))}
            {actions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col, idx) => (
                  <TableCell key={idx}>
                    {col.cell
                      ? col.cell(row)
                      : (row[col.accessorKey as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">
                    {actions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
