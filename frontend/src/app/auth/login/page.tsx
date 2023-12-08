"use client"

import React, {useState} from "react";
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'

import {Logomark} from "@/components/Logo";
import Link from "next/link";
import {signIn} from "next-auth/react";

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // TODO: Add error toast (by query parameter, too)
  // TODO: Abstract (card, input)

  // noinspection HtmlUnknownTarget
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logomark
          className="mx-auto h-10 w-auto"
        />
        <h2
          className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-neutral-950">
          Logge dich ein
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-neutral-950">
                Username
              </label>
              <div className="mt-2">
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-700 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  onChange={event => setUsername(event.target.value)}
                  value={username}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-950">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-700 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  onChange={event => setPassword(event.target.value)}
                  value={password}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button onClick={event => {
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
                  signIn('credentials', {
                    callbackUrl: '/dashboard',
                    username: username,
                    password: password
                  })
                }}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}