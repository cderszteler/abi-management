'use client'

import {TableWithBorder} from "@/components/Table";
import Pagination from "@/components/Pagination";
import {AdminQuote} from "@/lib/quotes";
import {fetcher} from "@/lib/backend";
import {RootLayoutContext} from "@/components/RootLayout";
import {ErrorToast} from "@/components/Toast";
import {useContext, useEffect, useState} from "react";
import useSWR from 'swr'
import {DashboardContext} from "@/app/dashboard/DashboardContextProvider";
import {hasRoles} from "@/lib/auth";
import {Copyable} from "@/components/Copyable";
import {AdminQuoteStatus} from "@/app/dashboard/admin/quote/AdminQuoteStatus";
import {OrderBy} from "@/app/dashboard/admin/OrderSelector";

const limit = 20

export function AdminQuotesTable(
{
  orderBy,
  userId,
  fallback,
  errorMessages,
  className
}: {
  orderBy: OrderBy
  userId: number | undefined
  fallback: string
  errorMessages: {fetch: string}
  className?: string
}) {
  const {addToast} = useContext(RootLayoutContext)!
  const { user } = useContext(DashboardContext)
  const isAdmin = hasRoles(user?.roles, ['Admin'])
  const [page, setPage] = useState(1)
  const {data, error, isLoading} = useSWR<{quotes: AdminQuote[], total: number}>(
    `/api/v1/admin/quotes?orderBy=${orderBy}${userId ? `&userId=${userId}` : ''}&page=${page - 1}&limit=${limit}`,
    fetcher
  )
  const loading = isLoading || error
  const total = data?.total || 1

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast content={errorMessages.fetch} retry={false}/>)
    }
  }, [error]);

  return (
    <div className={className}>
      <TableWithBorder
        loading={loading}
        separator={true}
        fallback={fallback}
        headers={[
          ...(isAdmin ? [{name: "Id"}] : []),
          {name: "Zitat"},
          {name: "Autoren"},
          {name: "Status"}
        ]}
        rows={loading ? [] : data!.quotes.map((quote) => [
          ...(isAdmin ? [
            {
              children: (<Copyable>{quote.id.toString()}</Copyable>)
            }
          ] : []),
          {
            className: "w-4/6",
            children: (
              <Copyable
                content={(quote.context ? `(${quote.context})\n` : '') + quote.content}
              >
                <>
                  {quote.context && (<span className="italic block">({quote.context})</span>)}
                  {quote.content}
                </>
              </Copyable>
            )
          },
          {
            className: "w-1/6",
            children: (
              quote.reviews.map((review, index) => (
                <span key={index} className="block">
                  <Copyable className="inline">{review.displayName}</Copyable>
                  {quote.reviews.length > 1 && quote.reviews.length - 1 !== index && ', '}
                </span>
              ))
            ),
          },
          {
            children: (
              <AdminQuoteStatus quote={quote}/>
            )
          }
        ])}
        loadingRow={[
          ...(isAdmin ? [{
            children: <div className="animate-pulse w-8 h-2 bg-neutral-300 rounded-md"/>
          }] : []),
          {
            className: "w-full",
            children: (
              <>
                <div className="animate-pulse w-40 lg:w-72 xl:w-10/12 h-2 bg-neutral-300 rounded-md"/>
                <div className="animate-pulse mt-2 w-12 lg:w-32 xl:w-7/12 h-2 bg-neutral-300 rounded-md"/>
              </>
            )
          },
          {
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