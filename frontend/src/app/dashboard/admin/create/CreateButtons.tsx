'use client'

import {useContext} from "react";
import {hasRoles} from "@/lib/auth";
import {DashboardContext} from "../../DashboardContextProvider";
import CreateQuoteButton from "@/app/dashboard/admin/create/CreateQuoteButton";
import CreateCommentButton from "./CreateCommentButton";
import CreateUserButton from "./CreateUserButton";

export default function CreateButtons() {
  const { user } = useContext(DashboardContext)
  const isAdmin = hasRoles(user?.roles, ['Admin'])

  return (
    <div className="h-[55vh] lg:h-[60vh] flex flex-col w-full gap-y-8 lg:gap-y-16">
      {isAdmin && (<CreateUserButton/>)}
      <CreateQuoteButton/>
      <CreateCommentButton/>
    </div>
  )
}