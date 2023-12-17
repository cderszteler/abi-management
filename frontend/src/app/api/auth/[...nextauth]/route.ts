import type {AuthOptions, User} from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt, {JwtPayload} from "jsonwebtoken"
import {backendUrl} from "@/lib/backend"

export type Authentication = {
  tokens: TokenPair
  user: {}
  error?: string
}

export type TokenPair = {
  accessToken: string
  refreshToken?: string | undefined
}

const oneHourInSeconds = 60 * 60

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "max.mustermann"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      // @ts-ignore
      authorize: async (credentials) => {
        let response
        try {
          response = await fetch(
            `${backendUrl}/api/v1/auth/authenticate`,
            {
              method: 'POST',
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password
              }),
              headers: {
                accept: '*/*', 'Content-Type': 'application/json',
              }
            })
        } catch (error) {
          console.log("could not connect to the sever")
          console.log(error)
          throw new Error("Could not connect to the server")
        }

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message)
        } else if (result) {
          const tokens = result?.tokens
          const decoded = jwt.decode(tokens?.accessToken as string) as JwtPayload
          return {
            user: result?.user,
            tokens: {
              ...tokens,
              exp: decoded?.exp,
              sub: decoded?.sub
            }
          }
        }

        return null
      }
    }),
  ],
  callbacks: {
    // The 'user' field is provided if the user has just logged in. It's the
    // result of the 'authorize' method above.
    // @ts-ignore
    jwt: async function ({token: authentication, user}: {
      token: Authentication,
      user: User
    }) {
      if (user) {
        return {
          ...authentication,
          ...user
        }
      }
      const decoded = jwt.decode(authentication.tokens.accessToken as string, {json: true})
      const expiredTimestamp = new Date((decoded?.exp || Date.now() - oneHourInSeconds) * 1000)

      const newAccessToken: RefreshedAccessToken = await (expiredTimestamp <= new Date()
        ? async () => await refreshAccessToken(authentication.tokens.refreshToken as string)
        : () => ({...authentication})
      )()
      return {
        ...authentication,
        ...newAccessToken
      }
    },

    // @ts-ignore
    session: async function ({session, token: authentication}: {
      session: any,
      token: Authentication
    }) {
      if (authentication.error) {
        session.error = authentication.error
        return session
      }
      session.accessToken = authentication.tokens.accessToken
      session.user = authentication.user

      return session
    },
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login'
  },
  debug: process.env.NODE_ENV === 'development',
}

type RefreshedAccessToken = {tokens: TokenPair} | {error: string}

async function refreshAccessToken(refreshToken: string): Promise<RefreshedAccessToken> {
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

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}