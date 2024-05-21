import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function CustomTable({ columns, data, enableSorting }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // console.log("columns: ", columns);

  const getTbody = () => {
    if (data?.length === 0) {
      return (
        <tr>
          <td>No Data Found</td>
        </tr>
      );
    } else {
      return (
        <>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </>
      );
    }
  };

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border capitalize">
                  {enableSorting ? (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.headers,
                              header.getContext()
                            )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>{getTbody()}</tbody>
      </table>
    </div>
  );
}

function Filter({ column }) {
  console.log(column);
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef ?? {};

  switch (filterVariant) {
    case "range":
      return (
        <div>
          <div className="flex space-x-2">
            {/* See faceted column filters example for min max values functionality */}
            <DebouncedInput
              type="number"
              value={columnFilterValue?.[0] ?? ""}
              onChange={(value) =>
                column.setFilterValue((old) => [value, old?.[1]])
              }
              placeholder={`Min`}
              className="w-24 border shadow rounded"
            />
            <DebouncedInput
              type="number"
              value={columnFilterValue?.[1] ?? ""}
              onChange={(value) =>
                column.setFilterValue((old) => [old?.[0], value])
              }
              placeholder={`Max`}
              className="w-24 border shadow rounded"
            />
          </div>
          <div className="h-1" />
        </div>
      );

    case "select":
      // console.log(columnFilterValue);

      return (
        <select
          onChange={(e) => column.setFilterValue(e.target.value)}
          value={columnFilterValue?.toString()}
        >
          {/* See faceted column filters example for dynamic select options */}
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      );

    default:
      return (
        <DebouncedInput
          className="w-36 border shadow rounded"
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Search...`}
          type="text"
          value={columnFilterValue ?? ""}
        />
      );
  }
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
