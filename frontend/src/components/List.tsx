import clsx from 'clsx'

import {Border} from '@/components/Border'
import {FadeIn, FadeInStagger} from '@/components/FadeIn'
import React from "react";

export function List({
  children,
  invert,
  className,
}: {
  children: React.ReactNode
  invert?: boolean
  className?: string
}) {
  return (
    <FadeInStagger>
      <ul
        role="list"
        className={clsx(
          'text-base',
          invert ? 'text-neutral-300' : 'text-neutral-600',
          className
        )}
      >
        {children}
      </ul>
    </FadeInStagger>
  )
}

export function ListItem({
  children,
  invert,
  title,
}: {
  children: React.ReactNode
  invert?: boolean
  title?: string
}) {
  return (
    <li className="group mt-10 first:mt-0">
      <FadeIn>
        <Border
          invert={invert}
          className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden"
        >
          {title && (
            <strong
              className={clsx(
                "font-semibold",
                invert ? 'text-white' : 'text-neutral-950'
              )}
            >
              {`${title}. `}
            </strong>
          )}
          {children}
        </Border>
      </FadeIn>
    </li>
  )
}
