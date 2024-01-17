'use client'

import {DashboardContext} from "@/app/dashboard/DashboardContextProvider";
import {hasRoles} from "@/lib/auth";
import {useRouter} from "next/navigation";
import {createContext, useContext, useEffect} from "react";
import {fetcher} from "@/lib/backend";
import {ErrorToast} from "@/components/Toast";
import {RootLayoutContext} from "@/components/RootLayout";
import useSWR from "swr";

export type DisplayUser = {
  id: number,
  displayName: string
}

export const DisplayUsersContext = createContext<DisplayUser[]>([])

export default function SecureAdminDashboardContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const {addToast} = useContext(RootLayoutContext)!
  const { user } = useContext(DashboardContext)!
  const {data, error} = useSWR<DisplayUser[]>(
    '/api/v1/user/dashboard/admin/users',
    fetcher
  )

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast
        content="Das erweiterte Dashboard konnte nicht vollständig geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        retry={false}
      />)
    }
  }, [error]);

  if (!hasRoles(user?.roles, ['Admin', 'Moderator'])) {
    router.push('/dashboard')
    return <></>
  }

  return (
    <>
      <DisplayUsersContext.Provider value={data || []}>
        {children}
      </DisplayUsersContext.Provider>
    </>
  )
}