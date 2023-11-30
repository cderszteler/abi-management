import Link from 'next/link'

import {Container} from '@/components/Container'
import {FadeIn} from '@/components/FadeIn'

export default function NotFound() {
  // TODO: Or return to dashboard
  return (
    <Container className="flex h-full items-center pt-24 sm:pt-32 lg:pt-40">
      <FadeIn className="flex max-w-xl flex-col items-center text-center">
        <p className="font-display text-4xl font-semibold text-neutral-950 sm:text-5xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-950">
          Seite nichte gefunden
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Entschuldigung, wir konnten die gesuchte Seite nicht finden.
        </p>
        <Link
          href="/"
          className="mt-4 text-sm font-semibold text-neutral-950 transition hover:text-neutral-700"
        >
          Zurück zur Startseite
        </Link>
      </FadeIn>
    </Container>
  )
}