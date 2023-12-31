import {PageHeading} from "@/components/PageIntro";
import {QuotesTable} from "@/app/dashboard/quotes/QuotesTable";
import Link from "next/link";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Zitate',
  description: 'Verwalte hier deine Zitate.',
}

export default function Quotes() {
  // noinspection HtmlUnknownTarget
  return (
    <>
      <PageHeading content="Zitate" className="lg:mb-8">
        <p>Verwalte hier deine Zitate!</p>
      </PageHeading>
      <QuotesTable
        title="Ausstehende Zitate"
        description={(
          <>
            Beachte, dass für ein Zitat, das mehre Personen beinhaltet,
            alle Personen diesem Zitat zustimmen müssen,
            damit dieses gedruckt werden kann.
            <br/>
            <span className="font-semibold">
              Nicht bearbeitete Zitate gelten als angenommen.
            </span>
          </>
        )}
        fallback="Es sind keine ausstehende Zitate vorhanden."
        errorMessages={{
          fetch: "Die ausstehenden Zitate konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        }}
        filter='Pending'
      />
      <QuotesTable
        className="mt-16"
        title="Bearbeitete Zitate"
        fallback="Es sind keine bearbeiteten Zitate vorhanden."
        errorMessages={{
          fetch: "Die bearbeiteten Zitate konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        }}
        filter='Processed'
      />
      <QuotesTable
        className="mt-16 pb-12"
        title="Nicht verfügbare Zitate"
        fallback="Es sind keine nicht verfügbaren Zitate vorhanden."
        description={
          <>
            Diese Zitate wurden von uns als unangemessen gekennzeichnet,
            nur du kannst sie sehen.
            Falls du das für einen Fehler hälst,
            <Link href="/contact" className="font-medium hover:text-neutral-500"> kontaktiere uns </Link>
            bitte.
          </>
        }
        errorMessages={{
          fetch: "Die nicht verfügbaren Zitate konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        }}
        filter='NotAllowed'
      />
    </>
  )
}