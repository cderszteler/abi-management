export type Quote = {
  id: number
  content: string
  status: 'Accepted' | 'Rejected' | 'Pending' | 'NotAllowed'
}