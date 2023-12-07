import {Metadata} from "next";
import {Container} from "@/components/Container";
import React from "react";
import {Logomark} from "@/components/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Logge dich ein.',
}

export default function Contact() {
  // noinspection HtmlUnknownTarget
  // TODO: Connect with next-auth
  // TODO: Update mail to username
  return (
    <>
      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="flex min-h-full flex-1 flex-col justify-center ">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Logomark
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-neutral-950">
              Logge dich ein
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-neutral-950">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-700 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-950">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-700 focus:ring-2 focus:ring-inset focus:ring-neutral-700 sm:text-sm sm:leading-6"
                    />
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
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}