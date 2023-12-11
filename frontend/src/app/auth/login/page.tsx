'use client'

import React, {useContext, useEffect, useState} from "react";
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import Link from "next/link";
import Card from "@/components/Card";
import {RootLayoutContext} from "@/components/RootLayout";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import ButtonToast from "@/components/Toast";
import clsx from "clsx";
import {ExclamationCircleIcon} from "@heroicons/react/20/solid";

export default function LoginForm() {
  const router = useRouter()
  const {addToast} = useContext(RootLayoutContext)!
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [invalidPassword, setInvalidPassword] = useState(false)

  useEffect(() => {
    setInvalidPassword(false)
  }, [password, username]);

  const login = async () => {
    const response = await signIn('credentials', {
      username: username,
      password: password,
      redirect: false
    })
    if (response?.ok) {
      router.push("/dashboard")
    } else if (response?.status === 401) {
      setInvalidPassword(true)
    } else if (response?.error) {
      addToast(<ButtonToast onRemove={() => {}}/>)
    }
  }

  // noinspection HtmlUnknownTarget
  return (
    <Card title="Logge dich ein" logo>
      <form className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium leading-6 text-neutral-950">
            Benutzername
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              className={clsx(
                "block w-full rounded-md border-0 py-1.5 text-neutral-950 ring-inset placeholder:text-neutral-700 focus:ring-inset sm:text-sm sm:leading-6",
                invalidPassword
                  ? "ring-2 ring-inset ring-red-500 focus:ring-2 focus:ring-red-500"
                  : "ring-1 ring-neutral-300 focus:ring-2 focus:ring-neutral-700"
              )}
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              onChange={event => setUsername(event.target.value)}
              value={username}
              required
            />
            <div
              className={clsx(
                "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
                invalidPassword ? "" : "hidden"
              )}
            >
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true"/>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-950">
            Passwort
          </label>
          <div className="relative mt-2">
            <input
              className={clsx(
                "block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset placeholder:text-neutral-700 focus:ring-inset sm:text-sm sm:leading-6",
                invalidPassword
                  ? "ring-2 ring-inset ring-red-500 focus:ring-2 focus:ring-red-500"
                  : "ring-1 ring-neutral-300 focus:ring-2 focus:ring-neutral-700"
              )}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              onChange={event => setPassword(event.target.value)}
              value={password}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button type="button" onClick={event => {
                event.preventDefault()
                setShowPassword(!showPassword)
              }}>
                {(() => {
                  return showPassword
                    ? <EyeSlashIcon className="h-5 w-5 text-neutral-950"/>
                    : <EyeIcon className="h-5 w-5 text-neutral-950"/>
                })()}
              </button>
            </div>
          </div>
        </div>

        <p className={clsx(
          "mt-2 text-sm text-red-600",
          invalidPassword ? "" : "hidden"
        )}>
          Die Logindaten sind nicht korrekt.
        </p>

        <div className="flex items-center justify-end">
          <div className="text-sm leading-6">
            <Link
              className="font-semibold text-neutral-950 hover:text-neutral-700"
              href="/contact"
            >
              Passwort vergessen?
            </Link>
          </div>
        </div>

        <div>
          <button
            className="flex w-full justify-center rounded-full bg-neutral-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-750"
            type="submit"
            onClick={async event => {
              event.preventDefault()
              await login()
            }}
          >
            Einloggen
          </button>
        </div>
      </form>
    </Card>
  )
}