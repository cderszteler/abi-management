import clsx from "clsx"

export type Color = 'red' | 'yellow' | 'green' | 'gray'

const classNames = {
  'red': "inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-500/10",
  'yellow': "inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-yellow-500/10",
  'green': "inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500/10",
  'gray': "inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gr-600 ring-1 ring-inset ring-gray-500/10"
}

export function PillWithBorder({color, children}: {
  color: Color,
  children: React.ReactNode
}) {
  return (
    <span className={clsx(classNames[color], "cursor-pointer")} data-tooltip-target="tooltip-animation">
      {children}
    </span>
  )
}