import {type Metadata} from 'next'

import {RootLayout} from '@/components/RootLayout'

import '@/styles/tailwind.css'
import React from "react";
import {getServerSession} from "next-auth";
import SafeSessionProvider from "@/components/SafeSessionProvider";
import {authOptions} from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    template: '%s - ABI.',
    default: 'ABI. - Verwalte dein Abitur!',
  },
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="h-full bg-neutral-950 text-base antialiased">
      <body className="flex min-h-full flex-col">
        <SafeSessionProvider session={session}>
          <RootLayout>
            {children}
          </RootLayout>
        </SafeSessionProvider>
      </body>
    </html>
  )
}