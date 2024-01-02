'use client'

import {RootLayoutContext} from "@/components/RootLayout";
import {fetcher} from "@/lib/backend";
import {ErrorToast} from "@/components/Toast";
import {createContext, useContext, useEffect, useMemo} from "react";
import useSWR from "swr";
import {User} from "@/lib/auth";

type DashboardData = {
  user: User
  expiringAt?: Date | undefined
}

type ContextProperties = Partial<DashboardData> & {
  isLoading: boolean
}

export const DashboardContext = createContext<ContextProperties>({
  isLoading: true
})

export default function DashboardContextProvider({children}: { children: React.ReactNode }) {
  const {addToast} = useContext(RootLayoutContext)!
  const {data, error, isLoading} = useSWR<DashboardData>('/api/v1/user/dashboard', fetcher)

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast
        content="Das Dashboard konnte nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        retry={false}
      />)
    }
  }, [error]);

  const contextValue = useMemo(() => {
    if (!data || error || isLoading) {
      return {
        isLoading: true
      }
    }

    return {
      ...data,
      isLoading: false,
      expiringAt: data.expiringAt && new Date(data.expiringAt)
    }
  }, [data, error, isLoading])

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  )
}