import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Kommentare',
  description: 'Verwalte hier alle Kommentare.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}