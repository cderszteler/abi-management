export type UserQuote = {
  id: number
  content: string
  context: string | undefined
  status: 'Accepted' | 'Rejected' | 'Pending' | 'Expired' | 'NotAllowed'
  expired: boolean
}

export type AdminQuote = {
  id: number
  content: string
  context: string | undefined
  reviewStatus: UserQuote['status'] | 'PartiallyAccepted' | 'PartiallyRejected'
  reviews: {
    displayName: string
    status: 'Accepted' | 'Rejected' | 'Pending' | 'Expired'
  }[]
}