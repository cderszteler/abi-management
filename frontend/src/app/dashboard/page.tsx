import {Metadata} from "next"
import {getSession} from "@/lib/auth";
import {PageHeading} from "@/components/PageIntro";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Willkommen im Dashboard!',
}

export default async function Dashboard() {
  const session = await getSession()
  // @ts-ignore
  const displayName = session?.user?.displayName

  return (
    <>
      <PageHeading content={`Ahoi, ${displayName}!`}/>
    </>
  )
}