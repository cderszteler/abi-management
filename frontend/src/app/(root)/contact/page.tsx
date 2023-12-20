import React from 'react'
import {type Metadata} from 'next'
import Link from 'next/link'

import {Border} from '@/components/Border'
import {Container} from '@/components/Container'
import {FadeIn} from '@/components/FadeIn'
import {PageIntro} from '@/components/PageIntro'
import {SocialMedia} from '@/components/SocialMedia'

function ContactDetails() {
  return (
    <FadeIn>
      <h2 className="font-display text-base font-semibold text-neutral-950">
        Schreib uns eine Email
      </h2>
      <p className="mt-6 text-base text-neutral-600">
        Aktuell sind wur nur per Email zu erreichen. Andernfalls kontaktiere
        uns bitte so, wie wir mit dir Kontakt aufgenommen haben.
      </p>
      <dl className="mt-10 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
        {[
          ['Support', 'general@qetz.de']
        ].map(([label, email]) => (
          <div key={email}>
            <dt className="font-semibold text-neutral-950">{label}</dt>
            <dd>
              <Link
                href={`mailto:${email}`}
                className="text-neutral-600 hover:text-neutral-950"
              >
                {email}
              </Link>
            </dd>
          </div>
        ))}
      </dl>

      <Border className="mt-16 pt-16">
        <h2 className="font-display text-base font-semibold text-neutral-950">
          Follow us
        </h2>
        <SocialMedia className="mt-6" />
      </Border>
    </FadeIn>
  )
}

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Schreib uns und wir helfen dir aus.',
}

export default function Contact() {
  return (
    <>
      <PageIntro eyebrow="Kontakt" title="Fragen oder Probleme?">
        <p>Schreib uns und wir helfen dir aus.</p>
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
          <ContactDetails />
        </div>
      </Container>
    </>
  )
}
