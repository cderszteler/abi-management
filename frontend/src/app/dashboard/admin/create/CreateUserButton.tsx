'use client'

import {useContext, useId, useMemo, useState} from "react";
import {UserCircleIcon} from "@heroicons/react/24/outline";

import {RootLayoutContext} from "@/components/RootLayout";
import clsx from "clsx";
import CreateButton from "@/app/dashboard/admin/create/CreateButton";
import {ErrorToast, SuccessToast} from "@/components/Toast";

type RequiredFields = 'firstName' | 'lastName' | 'username'

function validateFields(
  firstName: string,
  lastName: string,
  username: string
): RequiredFields[] {
  const invalidFields: RequiredFields[] = []
  if (!firstName) {
    invalidFields.push('firstName')
  }
  if (!lastName) {
    invalidFields.push('lastName')
  }
  if (!username) {
    invalidFields.push('username')
  }
  return invalidFields
}

function Input({label, value, onChange, invalid, error}: {
  label: string,
  value: string,
  onChange: (value: string) => void
  invalid: boolean
  error: string
}) {
  const id = useId()

  return (
    <div className="mt-4 col-span-full">
      <label htmlFor={id} className="block font-medium leading-6 text-neutral-950">
        {label}:
      </label>
      <div className="mt-1">
        <input
          className={clsx(
            "block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset focus:ring-2 focus:ring-inset text-sm !leading-tight",
            invalid
              ? "ring-2 ring-red-500 focus:ring-red-500"
              : "ring-1 ring-neutral-300 focus:ring-neutral-700"
          )}
          onChange={event => onChange(event.target.value)}
          value={value}
          id={id}
          type="text"
        />
      </div>
      {invalid && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default function CreateUserButton() {
  const {addToast} = useContext(RootLayoutContext)!
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')

  const [invalidFields, setInvalidFields] = useState<RequiredFields[]>([])
  const [submitting, setSubmitting] = useState(false)

  const modified = useMemo(
    () => !!(firstName || lastName || username),
    [firstName, lastName, username]
  )

  const submit = async () => {
    const invalidFields = validateFields(firstName, lastName, username)
    if (invalidFields.length !== 0) {
      setInvalidFields(invalidFields)
      return
    }
    setSubmitting(true)
    const response = await fetch(`/api/v1/user`, {
      body: JSON.stringify({firstName, lastName, username}),
      method: 'POST'
    })
    setSubmitting(false)
    if (response.ok) {
      setFirstName('')
      setLastName('')
      setUsername('')
      addToast(<SuccessToast content="Der Benutzer wurde erfolgreich erstellt!"/>)
    } else if (response.status === 409) {
      addToast(<ErrorToast
        content="Ein Benutzer mit diesem Nutzernamen existiert bereits. Bitte wähle einen anderen!"
        retry={false}
      />)
    } else {
      addToast(<ErrorToast
        content="Der Benutzer konnte nicht erstellt werden. Bitte probiere es erneut oder kontaktiere uns!"
        onRetry={async () => submit()}
      />)
    }
  }

  return (
    <CreateButton
      title="Benutzer hinzufügen"
      icon={UserCircleIcon}
      warnBeforeClosing={modified}
      onClose={() => setInvalidFields([])}
      submitting={submitting}
      submit={submit}
    >
      <Input
        label="Vorname"
        value={firstName}
        onChange={(value) => {
          setFirstName(value)
          setInvalidFields(invalidFields.filter(invalid => invalid !== 'firstName'))
        }}
        invalid={invalidFields.includes('firstName')}
        error="Bitte gib einen Vornamen ein!"
      />
      <Input
        label="Nachname"
        value={lastName}
        onChange={(value) => {
          setLastName(value)
          setInvalidFields(invalidFields.filter(invalid => invalid !== 'lastName'))
        }}
        invalid={invalidFields.includes('lastName')}
        error="Bitte gib einen Nachnamen ein!"
      />
      <Input
        label="Nutzername"
        value={username}
        onChange={(value) => {
          setUsername(value)
          setInvalidFields(invalidFields.filter(invalid => invalid !== 'username'))
        }}
        invalid={invalidFields.includes('username')}
        error="Bitte gib einen Nutzernamen ein!"
      />
    </CreateButton>
  )
}