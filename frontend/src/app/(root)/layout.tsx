import {DefaultLayout} from '@/components/RootLayout'

import '@/styles/tailwind.css'
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DefaultLayout>
      {children}
    </DefaultLayout>
  )
}