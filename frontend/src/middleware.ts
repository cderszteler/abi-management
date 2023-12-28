import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {backendUrl} from "@/lib/backend";
import {encode, getToken, JWT} from 'next-auth/jwt';
import {hasTokenExpired, refreshAccessToken} from "@/lib/refresh";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/((?!auth).*)"
  ]
}

const sessionCookie = process.env.NEXTAUTH_URL?.startsWith("https://")
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request })

  if (isValidApiDestination(request.nextUrl.pathname)) {
    return await handleApiRequest(request, session)
  } else if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url), { status: 307 })
  }
  const response = NextResponse.next()

  // Token refreshing required on initial page loading
  // @ts-ignore
  if (hasTokenExpired(session?.tokens?.accessToken)) {
    // @ts-ignore
    const newAccessToken = await refreshAccessToken(session?.tokens?.refreshToken)
    const newSession = await encode({
      secret: process.env.NEXTAUTH_SECRET as string,
      token: {
        ...session,
        ...newAccessToken,
      },
    })

    response.cookies.set(sessionCookie, newSession)
  }

  return response
}

async function handleApiRequest(request: NextRequest, session?: JWT | null) {
  const requestHeaders = new Headers(request.headers)

  if (session) {
    // @ts-ignore
    requestHeaders.set("Authorization", `Bearer ${session?.tokens?.accessToken}`)
  }
  requestHeaders.set("Accept", "*/*")
  requestHeaders.set("Content-Type", "application/json")

  return NextResponse.rewrite(
    `${backendUrl}${request.nextUrl.pathname}?${request.nextUrl.searchParams}`,
    {
      request: {
        headers: requestHeaders
      }
    }
  );
}

const validApiDestination = /\/api\/(?!auth).+/

function isValidApiDestination(url: string) {
  return url.match(validApiDestination)
}