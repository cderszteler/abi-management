import clsx from "clsx"

export type Color = 'red' | 'yellow' | 'green' | 'gray'

const classNames = {
  'red': "bg-red-50 text-red-600 ring-red-500/50",
  'yellow': "bg-yellow-50 text-yellow-600 ring-yellow-500/50",
  'green': "bg-green-50 text-green-600 ring-green-500/50",
  'gray': "bg-gray-50 text-gray-600 ring-gray-500/50"
}

export function PillWithBorder({color, className, children}: {
  color?: Color | undefined
  className?: string | undefined
  children: React.ReactNode
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-center ring-1 ring-inset cursor-default lg:whitespace-nowrap",
        color && classNames[color],
        className
      )}
      data-tooltip-target="tooltip-animation"
    >
      {children}
    </span>
  )
}