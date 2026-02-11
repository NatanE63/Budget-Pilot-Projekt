import React from "react";

// Generic column definition
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

// Generic component props
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

// Generic component with <T> type parameter
function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "Brak danych.",
}: DataTableProps<T>) {
  const getCellValue = (
    item: T,
    accessor: Column<T>["accessor"],
  ): React.ReactNode => {
    if (typeof accessor === "function") {
      return accessor(item);
    }
    return String(item[accessor] ?? "");
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`p-3 text-left ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-b last:border-0 hover:bg-muted/50"
            >
              {columns.map((col, i) => (
                <td key={i} className={`p-3 ${col.className ?? ""}`}>
                  {getCellValue(item, col.accessor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
