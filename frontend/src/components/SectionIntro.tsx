import clsx from 'clsx'

import {Container} from '@/components/Container'
import {FadeIn} from '@/components/FadeIn'
import React from "react";

function SectionContent({
  title,
  eyebrow,
  children,
  smaller = false,
  invert = false
}: {
  title: string
  eyebrow?: string
  children?: React.ReactNode
  smaller?: boolean
  invert?: boolean
}) {
  return (
    <>
      <h2>
        {eyebrow && (
          <>
            <span
              className={clsx(
                'mb-6 block font-display text-base font-semibold',
                invert ? 'text-white' : 'text-neutral-950',
              )}
            >
              {eyebrow}
            </span>
            <span className="sr-only"> - </span>
          </>
        )}
        <span
          className={clsx(
            'block font-display tracking-tight [text-wrap:balance]',
            smaller
              ? 'text-2xl font-semibold'
              : 'text-4xl font-medium sm:text-5xl',
            invert ? 'text-white' : 'text-neutral-950',
          )}
        >
          {title}
        </span>
      </h2>
      {children && (
        <div
          className={clsx(
            'mt-6 text-xl',
            invert ? 'text-neutral-300' : 'text-neutral-600',
          )}
        >
          {children}
        </div>
      )}
    </>
  )
}

export function SectionHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SectionContent> & {className?: string}) {
  return (
    <div className={className}>
      <SectionContent {...props}></SectionContent>
    </div>
  )
}

export function SectionIntro(
  properties: Omit<React.ComponentPropsWithoutRef<typeof Container>, 'title' | 'children'>
    & React.ComponentPropsWithoutRef<typeof SectionContent>
) {
  return (
    <Container {...properties}>
      <FadeIn className="max-w-2xl">
        <SectionContent {...properties}></SectionContent>
      </FadeIn>
    </Container>
  )
}