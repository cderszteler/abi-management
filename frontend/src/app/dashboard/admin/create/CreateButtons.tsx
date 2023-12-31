'use client'

import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline"
import {useContext} from "react";
import {hasRoles} from "@/lib/auth";
import {DashboardContext} from "../../DashboardContextProvider";
import AddQuoteButton from "@/app/dashboard/admin/create/AddQuoteButton";

export function Button({content, onClick, ...props}: {
  content: string
  icon: typeof ChatBubbleOvalLeftEllipsisIcon
  onClick?: (() => void) | undefined
}) {
  // TODO: cursor-wait & disable hover when loading users
  return (
    <>
      <div className="h-full max-h-80 border-4 border-dashed rounded-3xl border-neutral-300 hover:scale-105 transition">
        <button
          className="w-full h-full p-2 sm:p-4 flex flex-col items-center justify-center gap-y-4 sm:gap-y-8 focus:rounded-3xl"
          onClick={event => {
            event.preventDefault()
            if (onClick) {
              onClick()
            }
          }}
        >
          <props.icon className="w-16 text-neutral-500/80"/>
          <span className="font-display font-medium text-3xl text-neutral-800/80">
            {content}
          </span>
        </button>
      </div>
    </>
  )
}

export default function CreateButtons() {
  const { user } = useContext(DashboardContext)
  const isAdmin = hasRoles(user?.roles, ['Admin'])

  return (
    <div className="h-[55vh] lg:h-[60vh] flex flex-col w-full gap-y-8 lg:gap-y-16">
      {isAdmin && (
        <Button icon={UserCircleIcon} content="Benutzer hinzufügen"/>
      )}
      <AddQuoteButton/>
      <Button icon={PencilSquareIcon} content="Kommentar hinzufügen"/>
    </div>
  )
}