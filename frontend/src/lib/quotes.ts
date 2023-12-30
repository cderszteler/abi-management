export type Quote = {
  id: number
  content: string
  context: string | undefined
  status: 'Accepted' | 'Rejected' | 'Pending' | 'Expired' | 'NotAllowed'
  expired: boolean
}