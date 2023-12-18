'use client'

import {TableWithBorder} from "@/components/Table";
import {BooleanActionButtonGroup} from "@/components/Button";
import Pagination from "@/components/Pagination";
import {fetcher} from "@/lib/backend";
import {RootLayoutContext} from "@/components/RootLayout";
import ErrorToast from "@/components/Toast";
import {useContext, useEffect, useState} from "react";
import useSWR, {useSWRConfig} from 'swr'
import {Color, PillWithBorder} from "@/components/Badge";
import {Tooltip} from "@/components/Tooltip";
import {SectionHeader} from "@/components/SectionIntro";
import {Comment} from "@/lib/comments";

const statusDescriptions: { [key:string]: { color: Color, name: string, description: string } } = {
  'Accepted': {
    color: "green",
    name: "Angenommen",
    description: "Du hast diesen Kommentar angenommen"
  },
  'Pending': {
    color: "yellow",
    name: "Ausstehend",
    description: "Diesen Kommentar hast du noch nicht bearbeitet"
  },
  'Rejected': {
    color: "red",
    name: "Abgelehnt",
    description: "Du hast diesen Kommentar abgelehnt"
  }
}

export function CommentsTable(
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
  filter: 'Pending' | 'Processed'
}) {
  const {addToast} = useContext(RootLayoutContext)!
  const [page, setPage] = useState(1)
  const {mutate} = useSWRConfig()
  const {data, error, isLoading} = useSWR<{comments: Comment[], total: number}>(
    `/api/v1/comments?filter=${filter}&page=${page - 1}&limit=20`,
    fetcher
  )
  const loading = isLoading || error

  useEffect(() => {
    if (error) {
      addToast(<ErrorToast content={errorMessages.fetch} retry={false}/>)
    }
  }, [error]);

  const handleReview = async (parameters: Parameters<typeof reviewComment>[0]) => {
    const ok = await reviewComment(parameters)
    if (!ok) {
      addToast(<ErrorToast
        content="Der Kommentar konnte nicht bearbeitet werden. Bitte probiere es erneut oder kontaktiere uns."
        onRetry={async () => await handleReview(parameters)}
        retry={true}
      />)
    } else {
      await mutate((key) => typeof key === 'string'
        && key.startsWith("/api/v1/comments")
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
        rows={loading ? [] : data!.comments.map((comment) => [
          {
            text: comment.content,
            className: "w-full"
          },
          {
            children: createStatus(comment.status)
          },
          {
            children: (
              <BooleanActionButtonGroup
                onClick={async (allowed) => handleReview({
                  commentId: comment.id,
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
      {page > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          total={loading ? 1 : Math.ceil(data!.total/20)}
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
      <PillWithBorder color={description?.color || 'red'}>
        {description?.name || "Fehler"}
      </PillWithBorder>
    </Tooltip>
  )
}

async function reviewComment({status, commentId}: {
  status: Extract<Comment['status'], 'Accepted' | 'Rejected'>
  commentId: number
}): Promise<boolean> {
  const response = await fetch('/api/v1/comment/review', {
    body: JSON.stringify({commentId, status}),
    method: 'POST'
  })
  return response.ok
}