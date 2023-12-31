'use client'

import {hasRoles} from "@/lib/auth";
import {DashboardContext} from "@/app/dashboard/layout";
import {useRouter} from "next/navigation";
import {useContext} from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const context = useContext(DashboardContext)!

  if (!hasRoles(context.user.roles, ['Admin', 'Moderator'])) {
    router.push('/dashboard')
    return <></>
  }

  return children
}