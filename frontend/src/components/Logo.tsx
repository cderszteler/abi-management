import React, {useId} from 'react'
import clsx from 'clsx'

export function Logomark({
  invert = false,
  filled = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean
  filled?: boolean
}) {
  let id = useId()

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect
        clipPath={`url(#${id}-clip)`}
        className={clsx(
          'h-8 transition-all duration-300',
          invert ? 'fill-white' : 'fill-neutral-950',
          filled ? 'w-8' : 'w-0 group-hover/logo:w-8',
        )}
      />
      <use
        href={`#${id}-path`}
        className={invert ? 'stroke-white' : 'stroke-neutral-950'}
        fill="none"
        strokeWidth="1.5"
      />
      <defs>
        <svg id={`${id}-path`}>
          <path
            id={`${id}-path-fill`}
            d="M 4.884 11.71 C 4.545 14.31 4.342 16.926 4.2780000000000005 19.547 C 7.833 21.032 11.237 22.856 14.442 24.993 C 17.648 22.856 21.052 21.032 24.608 19.547 C 24.543 16.926 24.341 14.31 24.001 11.71 M 4.883 11.71 C 8.179 12.818 11.376 14.198 14.442 15.837 C 17.508 14.198 20.705 12.818 24 11.71 M 4.883 11.71 C 3.799 11.345 2.7039999999999997 11.01 1.601 10.706 C 5.631 7.88 9.933 5.464 14.442 3.493 C 18.952 5.464 23.254 7.8790000000000004 27.283 10.705 C 26.177 11.011 25.082 11.347 24.001 11.71"
          />
          <path
            d="M 5.79 23.868 C 7.181 22.48 7.962 20.594 7.959 18.629 L 7.959 16.776"
          />
          <path
            d="M 7.959 17.701999999999998 L 7.959 13.164 C 10.054 11.862 12.219 10.674 14.442 9.606"
          />
          <path
            d="M 7.959 17.701999999999998 C 8.672 17.701999999999998 9.118 16.931 8.761 16.313 C 8.596 16.027 8.29 15.85 7.959 15.85 C 7.246 15.85 6.801 16.622 7.157 17.239 C 7.323 17.526 7.628 17.701999999999998 7.959 17.701999999999998 Z"
          />
        </svg>
        <clipPath id={`${id}-clip`}>
          <use href={`#${id}-path-fill`} />
        </clipPath>
      </defs>
    </svg>
  )
}

export function Logo({
  className,
  invert = false,
  filled = false,
  fillOnHover = false,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  invert?: boolean
  filled?: boolean
  fillOnHover?: boolean
}) {
  return (
    <svg
      viewBox="0 0 130 32"
      aria-hidden="true"
      className={clsx(fillOnHover && 'group/logo', className)}
      {...props}
    >
      <Logomark
        preserveAspectRatio="xMinYMid meet"
        invert={invert}
        filled={filled}
      />
      <path
        className={invert ? 'fill-white' : 'fill-neutral-950'}
        d="M 38.991 14.628 L 39.146 14.628 L 39.207 14.448 L 39.549 14.448 L 39.611 14.628 L 39.765 14.628 L 39.483 13.808 L 39.274 13.808 Z M 39.243 14.333 L 39.323 14.103 L 39.376 13.944 L 39.382 13.944 L 39.433 14.103 L 39.514 14.333 Z M 39.862 14.628 L 40.235 14.628 C 40.417 14.628 40.523 14.547 40.523 14.395 C 40.523 14.302 40.472 14.225 40.374 14.206 L 40.374 14.198 C 40.457 14.176 40.501 14.104 40.501 14.018 C 40.501 13.892 40.417 13.808 40.252 13.808 L 39.862 13.808 Z M 40.006 14.153 L 40.006 13.923 L 40.214 13.923 C 40.297 13.923 40.351 13.963 40.351 14.039 C 40.351 14.107 40.311 14.153 40.223 14.153 Z M 40.006 14.512 L 40.006 14.265 L 40.23 14.265 C 40.318 14.265 40.372 14.305 40.372 14.386 C 40.372 14.462 40.323 14.512 40.22 14.512 Z M 40.66 14.628 L 40.808 14.628 L 40.808 13.808 L 40.66 13.808 Z M 40.961 14.628 L 41.097 14.628 L 41.097 14.493 L 40.961 14.493 Z"
        transform="matrix(32.258266, 0, 0, 23.73111, -1212.382203, -321.398559)"
      />
    </svg>
  )
}
