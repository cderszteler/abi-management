'use client'

import {AdminQuote} from "@/lib/quotes";
import {Color, PillWithBorder} from "@/components/Badge";
import {Tooltip} from "@/components/Tooltip";
import clsx from "clsx";

export const reviewStatusDescriptions: { [key:string]: {
  color: Color,
  backgroundColor: string,
  name: string
} } = {
  'Accepted': {
    color: "green",
    backgroundColor: "bg-green-50",
    name: "Angenommen"
  },
  'PartiallyAccepted': {
    color: "green",
    backgroundColor: "bg-green-50",
    name: "Teilweise Angenommen"
  },
  'Pending': {
    color: "yellow",
    backgroundColor: "bg-yellow-50",
    name: "Ausstehend"
  },
  'Rejected': {
    color: "red",
    backgroundColor: "bg-red-50",
    name: "Abgelehnt"
  },
  'PartiallyRejected': {
    color: "red",
    backgroundColor: "bg-red-50",
    name: "Teilweise Abgelehnt"
  },
  'Expired': {
    color: "gray",
    backgroundColor: "bg-gray-50",
    name: "Abgelaufen"
  },
  'NotAllowed': {
    color: "red",
    backgroundColor: "bg-red-100",
    name: "Nicht erlaubt"
  }
}

export function AdminQuoteStatus({quote}: {quote: AdminQuote}) {
  return (
    <Tooltip
      hidden={quote.reviewStatus === 'NotAllowed' || quote.reviews.length === 0}
      content={(
        <div className="relative flex flex-col items-start gap-y-2 text-sm py-2 px-1">
          {quote.reviews.map((review, index) => (
            <span key={index} className="inline-flex justify-between gap-x-4 w-full">
              {review.displayName}:
              <StatusPill status={review.status}/>
            </span>
          ))}
        </div>
      )}
    >
      <StatusPill status={quote.reviewStatus}/>
    </Tooltip>
  )
}

function StatusPill({status, clickable}: {
  status: AdminQuote['reviewStatus']
  clickable?: boolean
}) {
  const description = reviewStatusDescriptions[status]

  return (
    <PillWithBorder
      color={description?.color || 'red'}
      className={clsx(clickable && "cursor-pointer")}
    >
      {description?.name || "Fehler"}
    </PillWithBorder>
  )
}