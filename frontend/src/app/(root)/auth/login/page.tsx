'use client'

import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import Card from "@/components/Card";
import {RootLayoutContext} from "@/components/RootLayout";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import ErrorToast from "@/components/Toast";
import clsx from "clsx";
import {PasswordInputWithToggle, TextInput} from "@/components/Input";

export default function LoginForm() {
  const router = useRouter()
  const {addToast} = useContext(RootLayoutContext)!
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
    } else if (response?.error) {
      addToast(<ErrorToast
        content="Der Login hat nicht funktioniert.
        Bitte probiere es erneut oder kontaktiere uns!"
      />)
    } else if (response?.status === 401) {
      setInvalidPassword(true)
    }
  }

  // noinspection HtmlUnknownTarget
  return (
    <Card title="Logge dich ein" logo>
      <form className="space-y-6">
        <TextInput
          label="Benutzername"
          autoComplete="username"
          text={username}
          setText={setUsername}
          invalid={invalidPassword}
        />

        <PasswordInputWithToggle
          label="Passwort"
          autoComplete="current-password"
          password={password}
          setPassword={setPassword} invalid={invalidPassword}
        />

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