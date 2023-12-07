import {Container} from "@/components/Container";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Logge dich ein.',
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container className="mt-24 sm:mt-32 lg:mt-40">
        {children}
      </Container>
    </>
  )
}