import clsx from "clsx";

type TableHeader = {
  name?: string
  screenReader?: string
}

type TableColumn = {
  text?: string
  children?: React.ReactNode
  className?: string
}

// TODO:
//  - skeleton
//  - tooltip for status
//  - paging...
export function TableWithBorder({
  separator,
  headers,
  rows
}: {
  separator: boolean
  headers: TableHeader[]
  rows: TableColumn[][]
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
          {rows.map((columns, rowIndex) =>
            <TableRow key={rowIndex}>
              {columns.map((column, index) =>
                <TableColumn
                  key={index}
                  separator={separator}
                  side={index !== 0
                    ? index === (columns.length - 1) ? 'right' : null
                    : "left"
                  }
                  {...column}
                >
                  {column.children}
                </TableColumn>
              )}
            </TableRow>
          )}
        </tbody>
      </table>
    </div>
  )
}

function TableRow({children}: {children: React.ReactNode}) {
  return (
    <tr className="even:bg-neutral-50 min">
      {children}
    </tr>
  )
}

function TableColumn({text, side, separator = true, ...properties}: TableColumn & {
  separator: boolean
  side: React.ComponentPropsWithoutRef<typeof RowSeparator>['side']
}) {
  const border = calculateBorder({separator, side})
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

function calculateBorder({separator, side}:
  Pick<React.ComponentPropsWithoutRef<typeof TableColumn>, 'separator' | 'side'>
) {
  if (!separator) {
    return ""
  } else if (side) {
    return "border-t border-transparent"
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