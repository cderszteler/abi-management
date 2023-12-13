import {Container} from "@/components/Container";
import {Metadata} from "next";
import {getServerSession} from "next-auth/next";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen',
  description: 'Setze dein Passwort zurück.',
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <>
      <Container className="mt-24 sm:mt-32 lg:mt-40">
        {children}
      </Container>
    </>
  )
}