'use client'

import {CenteredLoading} from "@/components/Loading";
import {DashboardContext} from "@/app/dashboard/DashboardContextProvider";
import {useContext} from "react";
import clsx from "clsx";
import {Container} from "@/components/Container";

export default function DashboardContainer({children}: { children: React.ReactNode }) {
  const {isLoading} = useContext(DashboardContext)

  return (
    <main className={clsx("py-10 lg:pl-72", isLoading ? "h-full my-auto" : "")}>
      <div className="px-4 sm:px-6 lg:px-8 ">
        <Container>
          {(isLoading) && (
            <>
              <div
                className="absolute inset-x-0 top-0 w-full h-screen -z-10 bg-neutral-200 opacity-20"/>
              <div className="flex justify-center items-center">
                <CenteredLoading className="w-10"/>
              </div>
            </>
          )}
          {!isLoading && children}
        </Container>
      </div>
    </main>
  )
}