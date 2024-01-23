'use client'

import {TableWithBorder} from "@/components/Table";
import {BooleanActionButtonGroup} from "@/components/Button";
import Pagination from "@/components/Pagination";
import {UserQuote} from "@/lib/quotes";
import {fetcher} from "@/lib/backend";
import {RootLayoutContext} from "@/components/RootLayout";
import {ErrorToast} from "@/components/Toast";
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
  'Expired': {
    color: "gray",
    name: "Abgelaufen",
    description: "Du kannst dieses Zitat nicht mehr bearbeiten"
  },
  'NotAllowed': {
    color: "red",
    name: "Nicht erlaubt",
    description: "Dieses Zitat wurde von uns abgelehnt"
  }
}

const limit = 10

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
  description?: React.ReactNode
  fallback: string
  errorMessages: {fetch: string}
  className?: string
  filter: 'Pending' | 'Processed' | 'NotAllowed'
}) {
  const {addToast} = useContext(RootLayoutContext)!
  const [page, setPage] = useState(1)
  const {mutate} = useSWRConfig()
  const {data, error, isLoading} = useSWR<{quotes: UserQuote[], total: number}>(
    `/api/v1/quotes?filter=${filter}&page=${page - 1}&limit=${limit}`,
    fetcher
  )
  const loading = isLoading || error
  const total = data?.total || 1

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
        && !(key.includes("NotAllowed") || key.includes("Expired"))
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
        rows={loading ? [] : data!.quotes.map((quote) => ({
          columns: [
            {
              text: quote.content,
              className: "w-full",
              children: quote.context
                ? (<span className="italic block">({quote.context})</span>)
                : (<></>)
            },
            {
              children: createStatus(quote.status)
            },
            {
              children: (
                <Tooltip
                  hidden={!quote.expired}
                  content="Du kannst diesen Kommentar nicht mehr bearbeiten"
                >
                  <BooleanActionButtonGroup
                    disabled={quote.status === 'NotAllowed' || quote.expired}
                    onClick={async (allowed) => handleReview({
                      id: quote.id,
                      status: allowed ? 'Accepted' : 'Rejected'
                    })}
                  />
                </Tooltip>
              ),
              className: "lg:whitespace-nowrap"
            }
          ]
        }))}
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

function createStatus(status: string) {
  const description = statusDescriptions[status]
  return (
    <Tooltip content={description?.description || "Fehler"}>
      <PillWithBorder color={description?.color || 'red'} className="cursor-pointer">
        {description?.name || "Fehler"}
      </PillWithBorder>
    </Tooltip>
  )
}

async function reviewQuote({status, id}: {
  status: Extract<UserQuote['status'], 'Accepted' | 'Rejected'>
  id: number
}): Promise<boolean> {
  const response = await fetch(`/api/v1/quote/${id}/review`, {
    body: JSON.stringify({status}),
    method: 'POST'
  })
  return response.ok
}