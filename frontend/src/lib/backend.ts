export const backendUrl = process.env.BACKEND_URL

export const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    // @ts-ignore
    error.info = await res.json()
    // @ts-ignore
    error.status = res.status
    throw error
  }

  return res.json()
}

export const mutator = async (url: string, { arg: body }: { arg?: any }) => {
  const res = await fetch(
    url,
    {
      method: 'POST',
      body: JSON.stringify(body)
    }
  )

  if (!res.ok) {
    const error = new Error('An error occurred while mutating the data.')
    // Attach extra info to the error object.
    // @ts-ignore
    error.info = await res.json()
    // @ts-ignore
    error.status = res.status
    throw error
  }

  return res.json()
}