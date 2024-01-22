import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Zitate',
  description: 'Verwalte hier alle Zitate.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}