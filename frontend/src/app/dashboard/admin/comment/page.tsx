'use client'

import {PageHeading} from "@/components/PageIntro";
import AuthorsInput from "@/components/AuthorsInput";
import {User} from "@/lib/auth";
import {useContext, useEffect, useState} from "react";
import {OrderBy, OrderSelector} from "@/app/dashboard/admin/OrderSelector";
import {
  AdminCommentsTable
} from "@/app/dashboard/admin/comment/AdminCommentsTable";
import CreateCommentButton
  from "@/app/dashboard/admin/comment/CreateCommentButton";
import {Copyable} from "@/components/Copyable";
import {AdminComment} from "@/lib/comments";
import {fetcher} from "@/lib/backend";
import {ErrorToast} from "@/components/Toast";
import {RootLayoutContext} from "@/components/RootLayout";
import useSWR from "swr";
import Pagination from "@/components/Pagination";
import {ClipboardIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";

const limit = 20

export interface AdminComments {
  comments: AdminComment[]
  joinedComment: string | undefined
  total: number
}

export default function AdminComments() {
  const {addToast} = useContext(RootLayoutContext)!
  const [orderBy, setOrderBy] = useState<OrderBy>('createdAt')
  const [target, setTarget] = useState<User | undefined | null>()
  const [page, setPage] = useState(1)

  const {data, error, isLoading} = useSWR<AdminComments>(
    '/api/v1/admin/comments'
      + `?orderBy=${orderBy}${target?.id ? `&userId=${target?.id}` : ''}`
      + `&page=${page - 1}&limit=${limit}`,
    fetcher
  )
  const total = data?.total || 1

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast
        content="Die Kommentare konnten nicht geladen werden. Bitte lade die Seite neu oder kontaktiere uns."
        retry={false}/>
      )
    }
  }, [error]);

  useEffect(() => {
    setPage(1)
  }, [target]);

  // noinspection HtmlUnknownTarget
  return (
    <>
      <PageHeading content="Kommentare" className="lg:mb-8">
        <p>Verwalte hier alle Kommentare!</p>
      </PageHeading>
      <div className="mt-4 flex flex-col items-start gap-y-2 xl:flex-row xl:justify-between xl:gap-x-4">
        <div className="flex items-stretch gap-x-2">
          <CreateCommentButton/>
          <Copyable
            className={clsx(
              "h-full py-0.5 px-1 flex items-center justify-center",
              "border-2 border-dashed rounded-lg border-neutral-900/25 transition",
              target?.id ? "block" : "hidden"
            )}
            content={data?.joinedComment}
          >
            <ClipboardIcon className="w-5 text-neutral-600"/>
          </Copyable>
        </div>
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
              authors={target}
              setAuthors={setTarget}
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
      <AdminCommentsTable data={data} loading={isLoading || error}/>
      {Math.ceil(total/limit) > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          total={Math.ceil(total/limit)}
          className="mt-8"
        />
      )}
    </>
  )
}