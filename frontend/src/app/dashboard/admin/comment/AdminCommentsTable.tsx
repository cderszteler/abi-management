'use client'

import {TableWithBorder} from "@/components/Table";
import Pagination from "@/components/Pagination";
import {fetcher} from "@/lib/backend";
import {RootLayoutContext} from "@/components/RootLayout";
import {ErrorToast} from "@/components/Toast";
import {useContext, useEffect, useState} from "react";
import useSWR from 'swr'
import {DashboardContext} from "@/app/dashboard/DashboardContextProvider";
import {hasRoles} from "@/lib/auth";
import {Copyable} from "@/components/Copyable";
import {
  reviewStatusDescriptions
} from "@/app/dashboard/admin/quote/AdminQuoteStatus";
import {OrderBy} from "@/app/dashboard/admin/OrderSelector";
import {AdminComment} from "@/lib/comments";
import {StatusPill} from "@/components/Badge";

const limit = 20

export function AdminCommentsTable(
{
  orderBy,
  userId,
  className
}: {
  orderBy: OrderBy
  userId: number | undefined
  className?: string
}) {
  const {addToast} = useContext(RootLayoutContext)!
  const { user } = useContext(DashboardContext)
  const isAdmin = hasRoles(user?.roles, ['Admin'])
  const [page, setPage] = useState(1)
  const {data, error, isLoading} = useSWR<{comments: AdminComment[], total: number}>(
    `/api/v1/admin/comments?orderBy=${orderBy}${userId ? `&userId=${userId}` : ''}&page=${page - 1}&limit=${limit}`,
    fetcher
  )
  const loading = isLoading || error
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
  }, [userId]);

  return (
    <div className={className}>
      <TableWithBorder
        loading={loading}
        separator={true}
        fallback="Es konnten keine Kommentare mit den ausgewählten Filter gefunden werden."
        headers={[
          ...(isAdmin ? [{name: "Id"}] : []),
          {name: "Kommentar"},
          {name: "Adressat"},
          {name: "Status"}
        ]}
        rows={loading ? [] : data!.comments.map((comment) => ({
          className: reviewStatusDescriptions[comment.status]?.backgroundColor,
          alternatingBackground: false,
          columns: [
            ...(isAdmin ? [
              {
                children: (<Copyable>{comment.id.toString()}</Copyable>)
              }
            ] : []),
            {
              className: "w-4/6",
              children: (
                <Copyable
                  content={comment.content}
                >
                  <div className="font-medium text-gray-900 whitespace-pre-line">
                    {comment.content}
                  </div>
                </Copyable>
              )
            },
            {
              className: "w-1/6",
              text: comment.userDisplayName,
            },
            {
              children: (
                <StatusPill status={comment.status} clickable={false}/>
              )
            }
          ]
        }))}
        loadingRow={[
          ...(isAdmin ? [{
            children: <div className="animate-pulse w-8 h-2 bg-neutral-300 rounded-md"/>
          }] : []),
          {
            className: "w-4/6",
            children: (
              <>
                <div className="animate-pulse w-40 lg:w-72 xl:w-8/12 h-2 bg-neutral-300 rounded-md"/>
              </>
            )
          },
          {
            className: "w-1/6",
            children: <div className="animate-pulse w-24 xl:w-32 h-2 bg-neutral-300 rounded-md"/>
          },
          {
            children: <div className="animate-pulse w-16 h-2 bg-neutral-300 rounded-md"/>
          }
        ]}
      />
      {Math.ceil(total/limit) > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          total={Math.ceil(total/limit)}
          className="mt-8"
        />
      )}
    </div>
  )
}