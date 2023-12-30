export type Comment = {
  id: number
  content: string
  status: 'Accepted' | 'Rejected' | 'Pending' | 'Expired'
}