import {Metadata} from "next"
import {getSession} from "@/lib/auth";
import {GridPattern} from "@/components/GridPattern";
import Link from "next/link";
import {Button} from "@/components/Button";
import {ArrowRightIcon} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Willkommen im Dashboard!',
}

export default async function Dashboard() {
  const session = await getSession()
  // @ts-ignore
  const displayName = session?.user?.displayName

  // noinspection HtmlUnknownTarget
  return (
    <>
      <GridPattern
        className="absolute inset-x-0 -top-2 -z-10 h-screen w-full fill-neutral-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_60%,transparent_80%)]"
        yOffset={-96}
        interactive
      />
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1
            className="text-4xl font-bold tracking-tight sm:text-6xl"
          >
            {`Ahoi, ${displayName}!`}
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Du hast es hier hin geschafft, sehr gut! Fang doch gleich an
            und schau dir ein paar Zitate an. Falls du Fragen hast, kannst du
            uns einfach kontaktieren.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/dashboard/quotes">
              <Button className="px-6 py-2">
                Zitate
              </Button>
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Kontakt <ArrowRightIcon className="ml-0.5 inline w-3.5"/>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}