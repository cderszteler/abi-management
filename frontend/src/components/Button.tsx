import Link from 'next/link'
import clsx from 'clsx'
import React from "react";
import {CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';

export function ActionButton({className, disabled, children}: {
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}) {
  return (
    <button
      className={clsx(
        "group rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold ring-1 ring-inset shadow-inner lg:enabled:hover:-translate-y-1 lg:enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 transition",
        className
      )}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}

export function BooleanActionButtonGroup({disabled}: {disabled?: boolean}) {
  return (
    <>
      <ActionButton
        className="mb-4 lg:mb-0 lg:mr-4 bg-green-100 text-green-700 ring-green-500/40 shadow-green-300/80 hover:bg-green-200/80 hover:text-green-900 hover:ring-green-700/40"
        disabled={disabled}
      >
        <CheckIcon className="h-4 group-hover:scale-110"/>
      </ActionButton>
      <ActionButton
        className="bg-red-100 text-red-700 ring-red-500/40 shadow-red-300/80 hover:bg-red-200/80 hover:text-red-900 hover:ring-red-700/40"
        disabled={disabled}
      >
        <XMarkIcon className="h-4 group-hover:scale-110"/>
      </ActionButton>
    </>
  )
}

type ButtonProps = {
  invert?: boolean
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  invert = false,
  className,
  children,
  ...props
}: ButtonProps) {
  className = clsx(
    className,
    'inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition',
    invert
      ? 'bg-white text-neutral-950 hover:bg-neutral-200'
      : 'bg-neutral-950 text-white hover:bg-neutral-800',
  )

  let inner = <span className="relative top-px">{children}</span>

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    )
  }

  return (
    <Link className={className} {...props}>
      {inner}
    </Link>
  )
}
