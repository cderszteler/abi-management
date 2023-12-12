import {type Metadata} from 'next'
import {ContactSection} from '@/components/ContactSection'
import {PageIntro} from '@/components/PageIntro'
import React from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Impressum'
}

export default async function Imprint() {
  return (
    <>
      <PageIntro title="Impressum">
        <h1 className="font-display text-2xl font-semibold text-neutral-950">
          Name und Anschrift
        </h1>
        <p className="mt-6 text-base">
          Christoph Derszteler
          <br/>
          Habsburgerstr. 3
          <br/>
          Niederkassel 53859
          <br/>
          Deutschland
        </p>
        <h1 className="mt-10 font-display text-2xl font-semibold text-neutral-950">
          Kontakt
        </h1>
        <p className="mt-6 text-base">
          Email: <Link className="hover:text-neutral-950" href="mailto:general@qetz.de">general@qetz.de</Link>
        </p>
      </PageIntro>

      <ContactSection />
    </>
  )
}