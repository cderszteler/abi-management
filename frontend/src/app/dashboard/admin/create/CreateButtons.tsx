'use client'

import {createContext, useContext, useEffect} from "react";
import {hasRoles} from "@/lib/auth";
import {DashboardContext} from "../../DashboardContextProvider";
import AddQuoteButton from "@/app/dashboard/admin/create/AddQuoteButton";
import AddCommentButton from "./AddCommentButton";
import {RootLayoutContext} from "@/components/RootLayout";
import {fetcher} from "@/lib/backend";
import {ErrorToast} from "@/components/Toast";
import useSWR from "swr";

export type DisplayUser = {
  id: number,
  displayName: string
}

export const DisplayUsersContext = createContext<DisplayUser[]>([])

export default function CreateButtons() {
  const {addToast} = useContext(RootLayoutContext)!
  const { user } = useContext(DashboardContext)
  const isAdmin = hasRoles(user?.roles, ['Admin'])

  const {data, error} = useSWR<DisplayUser[]>(
    '/api/v1/user/dashboard/admin/users',
    fetcher
  )

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast
        content={"Das Admin Dashboard konnte nicht vollständig geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        }
        retry={false}
      />)
    }
  }, [error]);

  return (
    <DisplayUsersContext.Provider value={data || []}>
      <div className="h-[55vh] lg:h-[60vh] flex flex-col w-full gap-y-8 lg:gap-y-16">
        {/* TODO: Implement adding user isAdmin && (
          <Button icon={UserCircleIcon} content="Benutzer hinzufügen"/>
        )*/}
        <AddQuoteButton/>
        <AddCommentButton/>
      </div>
    </DisplayUsersContext.Provider>
  )
}