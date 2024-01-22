import {PageHeading} from "@/components/PageIntro";
import {Metadata} from "next";
import {AdminQuotesTable} from "@/app/dashboard/admin/quote/AdminQuotesTable";

export const metadata: Metadata = {
  title: 'Zitate',
  description: 'Verwalte hier alle Zitate.',
}

export default function AdminQuotes() {
  // noinspection HtmlUnknownTarget
  return (
    <>
      <PageHeading content="Zitate" className="lg:mb-8">
        <p>Verwalte hier alle Zitate!</p>
      </PageHeading>
      <AdminQuotesTable
        // TODO: Implement filters (e.g. orderBy)
        orderBy='CreatedAt'
        fallback="Es sind keine ausstehende Zitate vorhanden."
        errorMessages={{
          fetch: "Die ausstehenden Zitate konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        }}
      />
    </>
  )
}