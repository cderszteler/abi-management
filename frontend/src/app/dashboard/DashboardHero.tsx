'use client'

import {useContext, useMemo} from "react";
import {DashboardContext} from "@/app/dashboard/layout";
import {Button} from "@/components/Button";
import Link from "next/link";
import {
  ArrowRightIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";

export function DashboardHero() {
  const context = useContext(DashboardContext)!
  const expiringSoon = useMemo(() => {
    const limit = new Date()
    limit.setDate(limit.getDate() - 1)
    return !!(context.expiringAt && context.expiringAt >= limit);
  }, [context.expiringAt])

  return (
    <>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        {context.expiringAt && (
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className={clsx(
              "relative rounded-full px-3 py-1 flex items-center leading-6 text-gray-600 ring-1 ring-neutral-900/10 hover:ring-neutral-900/20 transition",
              expiringSoon ? "" : "text-sm"
            )}>
              {expiringSoon && (
                <ExclamationCircleIcon
                  className={clsx(
                    "mr-2 text-red-500",
                    expiringSoon ? "h-6" : "h-5"
                  )}
                  aria-hidden="true"
                />
              )}
              Bitte bearbeite deine Zitate bis zum
              <span className={clsx("transition-all",
                expiringSoon
                  ? "text-red-500 font-bold hover:text-xl"
                  : "text-neutral-950 font-semibold hover:text-lg"
              )}>
                &nbsp;
                {context.expiringAt.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        <div className="text-center">
          <h1
            className="text-4xl font-bold tracking-tight sm:text-6xl"
          >
            {`Ahoi, ${context.user.displayName}!`}
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