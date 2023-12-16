import clsx from "clsx"

export type Color = 'red' | 'yellow' | 'green' | 'gray'

const classNames = {
  'red': "bg-red-50 text-red-600 ring-red-500/10",
  'yellow': "bg-yellow-50 text-yellow-600 ring-yellow-500/10",
  'green': "bg-green-50 text-green-600 ring-green-500/10",
  'gray': "bg-gray-50 text-gr-600 ring-gray-500/10"
}

export function PillWithBorder({color, children}: {
  color: Color,
  children: React.ReactNode
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-center ring-1 ring-inset cursor-pointer",
        classNames[color]
      )}
      data-tooltip-target="tooltip-animation"
    >
      {children}
    </span>
  )
}