'use client'

import {useContext} from "react";
import {DashboardContext} from "@/app/dashboard/layout";

export function DashboardDisplayName() {
  const context = useContext(DashboardContext)
  return (
    <>
      {context?.user?.displayName}
    </>
  )
}