import {getToken, JWT} from "next-auth/jwt";
import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {TEMPORARY_REDIRECT_STATUS} from "next/constants";
import {backendUrl} from "@/lib/backend";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/((?!auth).*)"
  ]
}

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });

  if (isValidApiDestination(request.nextUrl.pathname)) {
    return await handleApiRequest(request, session)
  } else if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url), TEMPORARY_REDIRECT_STATUS)
  }

  return NextResponse.next()
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