import {useSession} from "next-auth/react"
import {useMemo} from "react"
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth/next";

export async function getSession() {
  return await getServerSession(authOptions)
}

export function useDisplayName(): string | null {
  const {data: session} = useSession()
  return useMemo(() => {
    if (session) {
      // @ts-ignore
      return session?.user?.displayName
    }
    return null
  }, [session])
}