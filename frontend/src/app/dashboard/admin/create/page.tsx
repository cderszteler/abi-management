import {PageHeading} from "@/components/PageIntro";
import CreateButtons from "@/app/dashboard/admin/create/CreateButtons";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Hinzufügen',
  description: 'Füge hier neue Inhalte für die Abizeitung hinzu.'
}

export default function CreatePage() {
  // TODO: Fetch users
  return (
    <>
      <PageHeading content="Hinzufügen" className="mb-4 lg:mb-8">
        <p>Füge hier neue Zitate und Kommentare hinzu.</p>
      </PageHeading>
      <CreateButtons/>
    </>
  )
}