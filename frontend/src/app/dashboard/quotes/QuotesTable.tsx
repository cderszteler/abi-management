'use client'

import {TableWithBorder} from "@/components/Table";
import {BooleanActionButtonGroup} from "@/components/Button";
import Pagination from "@/components/Pagination";
import {Quote} from "@/lib/quotes";
import {fetcher} from "@/lib/backend";
import {RootLayoutContext} from "@/components/RootLayout";
import ErrorToast from "@/components/Toast";
import {useContext, useEffect, useState} from "react";
import useSWR, {useSWRConfig} from 'swr'
import {Color, PillWithBorder} from "@/components/Badge";
import {Tooltip} from "@/components/Tooltip";
import {SectionHeader} from "@/components/SectionIntro";

const statusDescriptions: { [key:string]: { color: Color, name: string, description: string } } = {
  'Accepted': {
    color: "green",
    name: "Angenommen",
    description: "Du hast dieses Zitat angenommen"
  },
  'Pending': {
    color: "yellow",
    name: "Ausstehend",
    description: "Dieses Zitat hast du noch nicht bearbeitet"
  },
  'Rejected': {
    color: "red",
    name: "Abgelehnt",
    description: "Du hast dieses Zitat abgelehnt"
  },
  'NotAllowed': {
    color: "red",
    name: "Nicht erlaubt",
    description: "Dieses Zitat wurde von uns abgelehnt"
  }
}

export function QuotesTable(
{
  title,
  description,
  fallback,
  errorMessages,
  className,
  filter
}: {
  title: string
  description: React.ReactNode
  fallback: string
  errorMessages: {fetch: string}
  className?: string
  filter: 'Pending' | 'Processed' | 'NotAllowed'
}) {
  const {addToast} = useContext(RootLayoutContext)!
  const [page, setPage] = useState(1)
  const {mutate} = useSWRConfig()
  const {data, error, isLoading} = useSWR<{quotes: Quote[], total: number}>(
    `/api/v1/quotes?filter=${filter}&page=${page - 1}&limit=20`,
    fetcher
  )
  const loading = isLoading || error

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast content={errorMessages.fetch} retry={false}/>)
    }
  }, [error]);

  const handleReview = async (parameters: Parameters<typeof reviewQuote>[0]) => {
    const ok = await reviewQuote(parameters)
    if (!ok) {
      addToast(<ErrorToast
        content="Das Zitat konnte nicht bearbeitet werden. Bitte probiere es erneut oder kontaktiere uns."
        onRetry={async () => await handleReview(parameters)}
        retry={true}
      />)
    } else {
      await mutate((key) => typeof key === 'string'
        && key.startsWith("/api/v1/quotes")
        && !key.includes("NotAllowed")
        && !(filter === 'Processed' && key.includes("Pending"))
      )
    }
  }

  return (
    <div className={className}>
      <SectionHeader title={title} smaller={true}>
        {description && (
          <p className="text-base -mt-4">
            {description}
          </p>
        )}
      </SectionHeader>
      <TableWithBorder
        loading={loading}
        separator={true}
        fallback={fallback}
        headers={[{name: "Zitat"}, {name: "Status"}, {screenReader: "Aktionen"}]}
        rows={loading ? [] : data!.quotes.map((quote) => [
          {
            text: quote.content,
            children: quote.context
              ? (<span className="italic block">({quote.context})</span>)
              : (<></>)
          },
          {
            children: createStatus(quote.status)
          },
          {
            children: (
              <BooleanActionButtonGroup
                disabled={quote.status === 'NotAllowed'}
                onClick={async (allowed) => handleReview({
                  quoteId: quote.id,
                  status: allowed ? 'Accepted' : 'Rejected'
                })}
              />
            ),
            className: "lg:whitespace-nowrap"
          }
        ])}
        loadingRow={[
          {
            children: (
              <>
                <div className="animate-pulse w-40 lg:w-72 xl:w-10/12 h-2 bg-neutral-300 rounded-md"/>
                <div className="animate-pulse mt-2 w-12 lg:w-32 h-2 bg-neutral-300 rounded-md"/>
              </>
            )
          },
          {
            children: <div className="animate-pulse w-16 h-2 bg-neutral-300 rounded-md"/>
          },
          {
            children: <BooleanActionButtonGroup disabled={true}/>
          }
        ]}
      />
      <Pagination
        page={page}
        setPage={setPage}
        total={loading ? 1 : Math.ceil(data!.total/20)}
        className="mt-8"
      />
    </div>
  )
}

function createStatus(status: string) {
  const description = statusDescriptions[status]
  return (
    <Tooltip content={description?.description || "Fehler"}>
      <PillWithBorder color={description?.color || 'red'}>
        {description?.name || "Fehler"}
      </PillWithBorder>
    </Tooltip>
  )
}

async function reviewQuote({status, quoteId}: {
  status: Extract<Quote['status'], 'Accepted' | 'Rejected'>
  quoteId: number
}): Promise<boolean> {
  const response = await fetch('/api/v1/quote/review', {
    body: JSON.stringify({quoteId, status}),
    method: 'POST'
  })
  return response.ok
}