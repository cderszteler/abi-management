'use client'

import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline"
import {createContext, useContext, useEffect} from "react";
import {hasRoles} from "@/lib/auth";
import {DashboardContext} from "../../DashboardContextProvider";
import AddQuoteButton from "@/app/dashboard/admin/create/AddQuoteButton";
import AddCommentButton from "./AddCommentButton";
import {RootLayoutContext} from "@/components/RootLayout";
import {fetcher} from "@/lib/backend";
import ErrorToast from "@/components/Toast";
import useSWR from "swr";

export function Button({content, onClick, ...props}: {
  content: string
  icon: typeof ChatBubbleOvalLeftEllipsisIcon
  onClick?: (() => void) | undefined
}) {
  // TODO: cursor-wait & disable hover when loading users
  return (
    <>
      <div className="h-full max-h-80 border-2 border-dashed rounded-3xl border-neutral-900/25 hover:scale-105 transition">
        <button
          className="w-full h-full p-2 sm:p-4 flex flex-col items-center justify-center gap-y-4 sm:gap-y-8 focus:rounded-3xl"
          onClick={event => {
            event.preventDefault()
            if (onClick) {
              onClick()
            }
          }}
        >
          <props.icon className="w-16 text-neutral-300"/>
          <span className="font-display text-3xl text-neutral-600">
            {content}
          </span>
        </button>
      </div>
    </>
  )
}

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
        content={"Das Admin Dashboard konnte nicht vollständig geladen werden. "
          + "Bitte lade die Seite neu oder kontaktiere uns."
        }
        retry={false}
      />)
    }
  }, [error]);

  return (
    <DisplayUsersContext.Provider value={data || []}>
      <div className="h-[55vh] lg:h-[60vh] flex flex-col w-full gap-y-8 lg:gap-y-16">
        {isAdmin && (
          <Button icon={UserCircleIcon} content="Benutzer hinzufügen"/>
        )}
        <AddQuoteButton/>
        <AddCommentButton/>
      </div>
    </DisplayUsersContext.Provider>
  )
}