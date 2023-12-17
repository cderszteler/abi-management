import clsx from 'clsx'

import {Container} from '@/components/Container'
import {FadeIn} from '@/components/FadeIn'
import React from "react";

export function PageHeading({content, className, children}: {
  content: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={className}>
      <h1 className="block max-w-5xl text-5xl font-display font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-6xl lg:mt-8">
        {content}
      </h1>
      <div
        className="mt-2 max-w-3xl text-xl text-neutral-600"
      >
        {children}
      </div>
    </div>
  )
}

export function PageIntro({
  eyebrow,
  title,
  children,
  centered = false,
}: {
  eyebrow?: string
  title: string
  children: React.ReactNode
  centered?: boolean
}) {
  return (
    <Container
      className={clsx('mt-24 sm:mt-32 lg:mt-40', centered && 'text-center')}
    >
      <FadeIn>
        <h1>
          <span className="block font-display text-base font-semibold text-neutral-950">
            {eyebrow}
          </span>
          <span className="sr-only"> - </span>
          <span
            className={clsx(
              'mt-6 block max-w-5xl font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-6xl',
              centered && 'mx-auto',
            )}
          >
            {title}
          </span>
        </h1>
        <div
          className={clsx(
            'mt-6 max-w-3xl text-xl text-neutral-600',
            centered && 'mx-auto',
          )}
        >
          {children}
        </div>
      </FadeIn>
    </Container>
  )
}