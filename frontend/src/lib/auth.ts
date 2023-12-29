import {getServerSession} from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import {backendUrl} from "@/lib/backend";
import jwt, {JwtPayload} from "jsonwebtoken";
import {NextAuthOptions} from "next-auth";
import {
  hasTokenExpired,
  refreshAccessToken,
  RefreshedAccessToken,
  TokenPair
} from "@/lib/refresh";

export type User = {
  id: number,
  displayName: string,
  roles: ('Default' | 'Moderator' | 'Admin')[]
}

export type Authentication = {
  tokens: TokenPair
  user: User
  error?: string
}

export const authOptions: NextAuthOptions = {
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

      const newAccessToken: RefreshedAccessToken = await (hasTokenExpired(authentication.tokens.accessToken as string)
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
    strategy: "jwt",
  },
  jwt: {
    maxAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login'
  },
  debug: process.env.NODE_ENV === 'development',
}

export async function getSession() {
  return await getServerSession(authOptions)
}