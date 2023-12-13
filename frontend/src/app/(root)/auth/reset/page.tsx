// noinspection HtmlUnknownTarget

'use client'

import React, {useContext, useEffect, useMemo, useState} from "react";
import Card from "@/components/Card";
import {RootLayoutContext} from "@/components/RootLayout";
import {useSearchParams} from "next/navigation";
import clsx from "clsx";
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/20/solid";
import Link from "next/link";
import ErrorToast from "@/components/Toast";
import {PasswordInput, PasswordToggle} from "@/components/Input";

function InvalidToken({disabled}: {disabled: boolean}) {
  return (
    <div className={clsx(
      "flex flex-col gap-4 items-center -mt-6 text-red-500 text-center",
      disabled ? '' : 'hidden'
    )}>
      <ExclamationCircleIcon className="w-6"/>
      <p>Der verwendete Link ist ungültig.</p>
      <p className="-mt-4">
        Bitte probiere es erneut oder
        <Link
          href="/contact"
          className="font-semibold hover:text-red-600"
        > kontaktiere uns</Link>
        .
      </p>
    </div>
  )
}

function SuccessfulReset({ok}: {ok: boolean}) {
  return (
    <div className={clsx(
      "flex flex-col gap-4 items-center -mt-6 text-green-700 text-center",
      ok ? '' : 'hidden'
    )}>
      <CheckCircleIcon className="w-6"/>
      <p>Du hast dein Passwort zurückgesetzt.</p>
      <p className="-mt-4">
        Bitte
        <Link
          href="/auth/login"
          className="font-semibold hover:text-green-800"
        > logge dich ein</Link>
        , um auf das Dashboard zugreifen zu können.
      </p>
    </div>
  )
}

const uuidFormat = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g

function validToken(token: string | null) {
  return token && token.match(uuidFormat)
}

export default function ResetForm() {
  const params = useSearchParams()
  const {addToast} = useContext(RootLayoutContext)!
  const [ok, setOk] = useState(false)
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [show, setShow] = useState(false)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    setInvalid(false)
  }, [first, second]);

  const [token, disabled] = useMemo(() => {
    const token = params.get("token")
    return [token, !validToken(token)]
  }, [params])

    useEffect(() => {
    setInvalid(false)
  }, [first, setFirst]);

  const reset = async () => {
    if (first !== second) {
      setInvalid(true)
      return
    }
    const response = await fetch('/api/v1/auth/reset', {
      method: 'POST',
      body: JSON.stringify({
        token: token,
        password: first
      })
    })

    if (response.ok) {
      setOk(true)
    } else if (response.status === 404) {
      addToast(<ErrorToast
        content="Der angegebene Link ist ungültig. Bitte probiere es erneut oder kontaktiere uns!"
        onRetry={async () => await reset()}
      />)
    } else if (response.status === 410) {
      addToast(<ErrorToast
        content="Der angegebene Link ist abgelaufen. Bitte kontaktiere uns!"
        retry={false}
      />)
    } else {
      addToast(<ErrorToast
        content="Das Passwort konnte nicht zurückgesetzt werden. Bitte probiere es erneut oder kontaktiere uns!"
        onRetry={async () => await reset()}
      />)
    }
  }

  return (
    <Card className="flex flex-col gap-10" title="Setze dein Passwort zurück" logo>
      <InvalidToken disabled={disabled}/>
      <SuccessfulReset ok={ok}/>

      <form className="space-y-6">
        <PasswordInput
          label="Passwort"
          autoComplete="new-password"
          show={show}
          invalid={invalid}
          disabled={disabled}
          password={first}
          setPassword={setFirst}
        >
          <PasswordToggle show={show} setShow={setShow} disabled={disabled}/>
        </PasswordInput>
        <PasswordInput
          label="Passwort wiederholen"
          autoComplete="new-password"
          show={show}
          invalid={invalid}
          disabled={disabled}
          password={second}
          setPassword={setSecond}
        />

        <p className={clsx(
          "mt-2 text-sm text-red-600",
          invalid ? "" : "hidden"
        )}>
          Die Passwörter stimmen nicht überein.
        </p>

        <div>
          <button
            className={clsx(
              "flex w-full justify-center rounded-full bg-neutral-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-750",
              "disabled:cursor-not-allowed disabled:bg-neutral-950/40"
            )}
            disabled={disabled || invalid}
            type="submit"
            onClick={async event => {
              event.preventDefault()
              await reset()
            }}
          >
            Zurücksetzen
          </button>
        </div>
      </form>
    </Card>
  )
}