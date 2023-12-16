export const backendUrl = process.env.BACKEND_URL

export const fetcher = (url: string) => {
  return fetch(url).then(result => result.json())
}