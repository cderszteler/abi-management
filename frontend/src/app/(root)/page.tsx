import {type Metadata} from 'next'

import {ContactSection} from '@/components/ContactSection'
import {Container} from '@/components/Container'
import {FadeIn} from '@/components/FadeIn'
import {List, ListItem} from '@/components/List'
import {SectionIntro} from '@/components/SectionIntro'
import {StylizedImage} from '@/components/StylizedImage'
import imageWorking from '@/images/working.jpg'

function Services() {
  return (
    <div className="py-20 mt-24 sm:mt-32 lg:mt-40 rounded-4xl bg-neutral-950">
      <SectionIntro
        eyebrow="Services"
        title="Wir helfen dir, anzukommen."
        invert={true}
      >
        <p>
          Wir können dich dabei unterstützen, dich so darzustellen, wie du
          gesehen werden möchtest.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <div className="lg:flex lg:items-center lg:justify-end">
          <div className="flex justify-center lg:w-1/2 lg:justify-end lg:pr-12">
            <FadeIn className="w-[33.75rem] flex-none lg:w-[45rem]">
              <StylizedImage
                src={imageWorking}
                sizes="(min-width: 1024px) 41rem, 31rem"
                className="justify-center lg:justify-end"
              />
            </FadeIn>
          </div>
          <List invert={true} className="mt-16 lg:mt-0 lg:w-1/2 lg:min-w-[33rem] lg:pl-4">
            <ListItem invert={true} title="Zitate und Kommentare">
              Mit unseren Lösungen ermöglichen wir es dir, Zitate und Kommentare
              über dich nach deinen Wünschen zu filtern.
            </ListItem>
            <ListItem invert={true} title="Coming soon..">
              Sei gespannt!
            </ListItem>
          </List>
        </div>
      </Container>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Wir bemühen uns das beste Erlebnis für deine Abiturkonfiguration zu ermöglichen.',
}

export default async function Home() {
  return (
    <>
      <Container className="mt-24 sm:mt-32 md:mt-56">
        <FadeIn className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
            Konfiguriere dein Abitur.
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            Wir bemühen uns das beste Erlebnis für deine Abiturkonfiguration
            zu ermöglichen. Das ist unsere Motivation, uns ständig zu verbessern.
          </p>
        </FadeIn>
      </Container>

      <Services />

      <ContactSection />
    </>
  )
}