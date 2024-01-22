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
  status: 'NotAllowed' | undefined
  reviews: {
    displayName: string
    status: 'Accepted' | 'Rejected' | 'Pending' | 'Expired'
  }[]
}