import {Container} from "@/components/Container";
import {Metadata} from "next";
import {redirect} from "next/navigation";
import {getSession} from "@/lib/auth";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Logge dich ein.',
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

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