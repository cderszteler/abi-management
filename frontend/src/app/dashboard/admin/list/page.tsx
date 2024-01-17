import {PageHeading} from "@/components/PageIntro";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Hinzufügen',
  description: 'Siehe hier Bearbeitungen der Kommentare und Zitate.'
}

export default function CreatePage() {
  return (
    <>
      <PageHeading content="Erfassungen" className="mb-4 lg:mb-8">
        <p>Siehe dir hier die erfassten Bearbeitungen von Zitaten und Kommentaren an.</p>
      </PageHeading>
      {/* TODO: Implement content */}
    </>
  )
}