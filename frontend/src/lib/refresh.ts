import jwt from "jsonwebtoken";
import {backendUrl} from "@/lib/backend";

export type TokenPair = {
  accessToken: string
  refreshToken?: string | undefined
}

const oneHourInSeconds = 60 * 60

export function hasTokenExpired(token: string) {
  const decoded = jwt.decode(token, {json: true})
  const expiredTimestamp = new Date((decoded?.exp || Date.now() - oneHourInSeconds) * 1000)

  console.log("expired Timestamp: " + expiredTimestamp)
  console.log("refresh? " + (expiredTimestamp <= new Date()))

  return expiredTimestamp <= new Date()
}

export type RefreshedAccessToken = {tokens: TokenPair} | {error: string}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshedAccessToken> {
  const response = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
    method: 'POST',
    body: JSON.stringify({refreshToken: refreshToken}),
    headers: {
      accept: '*/*', 'Content-Type': 'application/json',
    }
  })
  const result = await response.json()

  if (!response.ok) {
    return {
      error: result.message
    }
  }
  return {
    tokens: result
  }
}