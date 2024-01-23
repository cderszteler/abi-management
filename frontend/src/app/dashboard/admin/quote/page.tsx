'use client'

import {PageHeading} from "@/components/PageIntro";
import {AdminQuotesTable} from "@/app/dashboard/admin/quote/AdminQuotesTable";
import AuthorsInput from "@/components/AuthorsInput";
import {User} from "@/lib/auth";
import {useState} from "react";
import {OrderBy, OrderSelector} from "@/app/dashboard/admin/OrderSelector";
import CreateQuoteButton from "@/app/dashboard/admin/quote/CreateQuoteButton";

export default function AdminQuotes() {
  const [orderBy, setOrderBy] = useState<OrderBy>('createdAt')
  const [user, setUser] = useState<User | undefined | null>()

  // noinspection HtmlUnknownTarget
  return (
    <>
      <PageHeading content="Zitate" className="lg:mb-8">
        <p>Verwalte hier alle Zitate!</p>
      </PageHeading>
      <div className="mt-4 flex flex-col items-start gap-y-2 xl:flex-row xl:justify-between xl:gap-x-4">
        <CreateQuoteButton/>
        <div className="flex flex-col gap-y-3 xl:flex-row xl:gap-x-4">
          <div className="flex items-center gap-x-2">
            <label htmlFor="authors" className="block font-medium leading-6 text-neutral-950">
              Benutzer:
            </label>
            <AuthorsInput
              nullable={true}
              multiple={false}
              invalid={false}
              size='normal'
              authors={user}
              setAuthors={setUser}
              className="relative min-w-40 sm:min-w-52 max-w-72"
            />
          </div>
          <div className="flex items-center justify-between xl:justify-normal gap-x-2">
            <label htmlFor="orderBy" className="block font-medium leading-6 text-neutral-950">
              Sortierung:
            </label>
            <OrderSelector orderBy={orderBy} setOrderBy={setOrderBy}/>
          </div>
        </div>
      </div>
      <AdminQuotesTable orderBy={orderBy} userId={user?.id}/>
    </>
  )
}