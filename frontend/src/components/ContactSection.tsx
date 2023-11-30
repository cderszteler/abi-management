import {Button} from '@/components/Button'
import {Container} from '@/components/Container'
import {FadeIn} from '@/components/FadeIn'
import {GridPattern} from "@/components/GridPattern";
import React from "react";

export function ContactSection() {
  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn className="relative isolate -mx-6 rounded-4xl bg-neutral-50 px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
        <GridPattern
          className="absolute inset-0 -z-10 h-full w-full fill-neutral-100 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_50%,transparent_60%)]"
          yOffset={-256}
        />
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-medium text-neutral-950 [text-wrap:balance] sm:text-4xl">
              Du hast Fragen oder Probleme?
            </h2>
            <div className="mt-6 flex">
              <Button href="/contact">
                Melde dich
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}