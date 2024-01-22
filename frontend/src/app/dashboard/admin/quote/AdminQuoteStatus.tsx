'use client'

import {AdminQuote} from "@/lib/quotes";
import {Color, PillWithBorder} from "@/components/Badge";
import {useMemo} from "react";

export function AdminQuoteStatus({quote}: {quote: AdminQuote}) {
  const description = useMemo(() => reviewStatusDescriptions[resolveStatus(quote)], [quote])
  return (
    <PillWithBorder color={description?.color || 'red'}>
      {description?.name || "Fehler"}
    </PillWithBorder>
  )
}

const reviewStatusDescriptions: { [key:string]: { color: Color, name: string } } = {
  'Accepted': {
    color: "green",
    name: "Angenommen"
  },
  'PartiallyAccepted': {
    color: "green",
    name: "Teilweise Angenommen"
  },
  'Pending': {
    color: "yellow",
    name: "Ausstehend"
  },
  'Rejected': {
    color: "red",
    name: "Abgelehnt"
  },
  'PartiallyRejected': {
    color: "red",
    name: "Teilweise Abgelehnt"
  },
  'Expired': {
    color: "gray",
    name: "Abgelaufen"
  },
  'NotAllowed': {
    color: "red",
    name: "Nicht erlaubt"
  }
}

function resolveStatus(quote: AdminQuote) {
  if (quote.status === 'NotAllowed') {
    return 'NotAllowed'
  }
  if (quote.reviews.length === 0) {
    return 'Pending'
  }
  let accepted = false
  let rejected = false
  let pending = false
  for (const review of quote.reviews) {
    switch (review.status) {
      case 'Accepted':
      case 'Expired' : {
        accepted = true
        break
      }
      case 'Rejected': {
        rejected = true
        break
      }
      case 'Pending': {
        pending = true
        break
      }
    }
  }
  if (rejected) {
    return pending || accepted ? 'PartiallyRejected' : 'Rejected'
  } else if (accepted) {
   return pending ? 'PartiallyAccepted' : 'Accepted'
  }
  return 'Pending'
}