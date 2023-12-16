import clsx from "clsx";
import React from "react";

type TableHeader = {
  name?: string
  screenReader?: string
}

type TableColumn = {
  text?: string
  className?: string
  children?: React.ReactNode
}

const loadingRows = 2

// TODO:
//  - tooltip for status
//  - paging...
export function TableWithBorder({
  separator,
  loading,
  headers,
  loadingRow,
  rows
}: {
  separator: boolean
  loading?: boolean
  headers: TableHeader[]
  rows: TableColumn[][]
  loadingRow: Omit<TableColumn, 'text'>[]
}) {
  return (
    <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
        <tr>
          {headers.map((column, index) =>
            <th
              key={index}
              scope="col"
              className={clsx(
                "text-left text-sm font-semibold text-gray-900",
                index !== 0
                  ? index === (headers.length - 1) ? "pl-3 pr-4 sm:pr-6" : "py-3.5 px-3"
                  : "pl-4 pr-3 sm:pl-6"
              )}
            >
              {column.name ? column.name : ""}
              {column.screenReader
                ? <span className="sr-only">{column.screenReader}</span>
                : <></>
              }
            </th>
          )}
        </tr>
        </thead>
        <tbody>
          {loading && [...Array(loadingRows)].map((e, rowIndex) =>
            <TableRow key={rowIndex}>
              {loadingRow.map((column, index) =>
                mapColumnToElement({column, index, separator,
                  isLast: (rowIndex + 1 === loadingRows),
                  side: index === 0 ? "left" : index === 2 ? "right" : null
                })
              )}
            </TableRow>
          )}
          {!loading && rows.map((columns, rowIndex) =>
            <TableRow key={rowIndex}>
              {columns.map((column, index) =>
                mapColumnToElement({
                  column,
                  index,
                  isLast: (rowIndex + 1 === rows.length),
                  separator,
                  side: index !== 0
                    ? index === (columns.length - 1) ? 'right' : null
                    : "left"
                })
              )}
            </TableRow>
          )}
        </tbody>
      </table>
    </div>
  )
}

function mapColumnToElement({column, index, isLast, separator, side}: {
  column: TableColumn
  index: number
  isLast: boolean,
  separator: boolean
  side: React.ComponentPropsWithoutRef<typeof RowSeparator>['side']
}) {
  return (
    <TableColumn
      key={index}
      isLast={isLast}
      separator={separator}
      side={side}
      {...column}
    >
      {column.children}
    </TableColumn>
  )
}

function TableRow({className, children}: {className?: string, children: React.ReactNode}) {
  return (
    <tr className={clsx("even:bg-neutral-50 min", className)}>
      {children}
    </tr>
  )
}

function TableColumn({text, side, separator = true, ...properties}: TableColumn & {
  separator: boolean
  isLast: boolean
  side: React.ComponentPropsWithoutRef<typeof RowSeparator>['side']
}) {
  const border = calculateBorder({separator, isLast: properties.isLast, side})
  const padding = calculatePadding(side)
  return (
    <td
      className={clsx(
        "relative text-sm font-medium",
        border,
        padding,
        properties.className
      )}
    >
      {text && (
        <div className="font-medium text-gray-900 whitespace-pre-line">
          {text}
        </div>
      )}
      {!text && properties.children}
      {separator && side && <RowSeparator side={side}/>}
    </td>
  )
}

function RowSeparator({side}: {side: 'left' | 'right' | null}) {
  if (!side) {
    return <></>
  }
  return (
    <div className={clsx(
      "absolute -top-px h-px bg-neutral-300",
      side === 'left' ? 'left-6 right-0' : 'left-0 right-6'
    )}/>
  )
}

function calculateBorder({separator, isLast, side}:
  Pick<React.ComponentPropsWithoutRef<typeof TableColumn>, 'separator' | 'isLast' | 'side'>
) {
  if (!separator) {
    return ""
  } else if (side && !isLast) {
    return "border-t border-transparent"
  } else if (isLast && side === "left") {
    return "border-t border-transparent sm:rounded-bl-lg"
  } else if (isLast && side === "right") {
    return "border-t border-transparent sm:rounded-br-lg"
  }
  return "border-t border-neutral-300"
}

function calculatePadding(side: React.ComponentPropsWithoutRef<typeof RowSeparator>['side']) {
  if (side === "left") {
    return "py-4 pl-4 pr-3 sm:pl-6"
  } else if (side === "right") {
    return "text-right py-3.5 pl-4 pr-4 sm:pr-6"
  }
  return "py-3.5 px-3"
}