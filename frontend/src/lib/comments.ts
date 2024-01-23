export type UserComment = {
  id: number
  content: string
  status: 'Accepted' | 'Rejected' | 'Pending' | 'Expired'
  expired: boolean
}

export type AdminComment = {
  id: number
  content: string
  status: 'Accepted' | 'Rejected' | 'Pending' | 'Expired'
  userDisplayName: string
}