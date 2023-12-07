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
    return NextResponse.redirect(new URL("/auth/login", request.url), {
      status: TEMPORARY_REDIRECT_STATUS
    })
  }

  return NextResponse.next()
}

async function handleApiRequest(request: NextRequest, session?: JWT | null) {
  const requestHeaders = new Headers(request.headers)

  if (session) {
    requestHeaders.set("Authorization", `Bearer ${session?.accessToken}`)
  }
  return NextResponse.rewrite(
    `${backendUrl}${request.nextUrl.pathname}`,
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