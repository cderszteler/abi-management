'use client'

import {DashboardContext} from "@/app/dashboard/DashboardContextProvider";
import {hasRoles} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {useContext} from "react";

export default function SecureAdminDashboardContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useContext(DashboardContext)!

  if (!hasRoles(user?.roles, ['Admin', 'Moderator'])) {
    router.push('/dashboard')
    return <></>
  }

  return children
}