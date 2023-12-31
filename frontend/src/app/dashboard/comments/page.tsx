import {PageHeading} from "@/components/PageIntro";
import {CommentsTable} from "@/app/dashboard/comments/CommentsTable";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Kommentare',
  description: 'Verwalte hier deine Kommentare.',
}

export default function Comments() {
  // noinspection HtmlUnknownTarget
  return (
    <>
      <PageHeading content="Kommentare" className="lg:mb-8">
        <p>Verwalte hier deine Kommentare!</p>
      </PageHeading>
      <CommentsTable
        title="Ausstehende Kommentare"
        description={(
          <>
            <span className="font-semibold">
              Nicht bearbeitete Kommentare gelten als angenommen.
            </span>
          </>
        )}
        fallback="Es sind keine ausstehende Kommentare vorhanden."
        errorMessages={{
          fetch: "Die ausstehenden Kommentare konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        }}
        filter='Pending'
      />
      <CommentsTable
        className="mt-16"
        title="Bearbeitete Kommentare"
        fallback="Es sind keine bearbeiteten Kommentare vorhanden."
        description=""
        errorMessages={{
          fetch: "Die bearbeiteten Kommentare konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        }}
        filter='Processed'
      />
    </>
  )
}