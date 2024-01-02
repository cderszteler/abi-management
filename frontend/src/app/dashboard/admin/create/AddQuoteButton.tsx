'use client'

import {useContext, useMemo, useState} from "react";
import {ChatBubbleOvalLeftEllipsisIcon} from "@heroicons/react/24/outline";
import {User} from "@/lib/auth";
import clsx from "clsx";
import AuthorsInput from "@/app/dashboard/admin/create/AuthorsInput";
import CreateButton from "./CreateButton";
import {ErrorToast, SuccessToast} from "@/components/Toast";
import {RootLayoutContext} from "@/components/RootLayout";

type RequiredFields = 'quote' | 'authors'

function validateFields(quote: string, authors: User[]): RequiredFields[] {
  const invalidFields: RequiredFields[] = []
  if (!quote) {
    invalidFields.push('quote')
  }
  if (authors.length === 0) {
    invalidFields.push('authors')
  }
  return invalidFields
}

export default function AddQuoteButton() {
  const {addToast} = useContext(RootLayoutContext)!

  const [quote, setQuote] = useState('')
  const [context, setContext] = useState('')
  const [authors, setAuthors] = useState<User[]>([])
  const [notAllowed, setNotAllowed] = useState(false)

  const [invalidFields, setInvalidFields] = useState<RequiredFields[]>([])
  const [submitting, setSubmitting] = useState(false)

  const modified = useMemo(
    () => !!(quote || context || authors.length != 0 || notAllowed),
    [quote, context, authors, notAllowed]
  )

  const submit = async () => {
    const invalidFields = validateFields(quote, authors)
    if (invalidFields.length !== 0) {
      setInvalidFields(invalidFields)
      return
    }
    setSubmitting(true)
    const response = await fetch(`/api/v1/quote`, {
      body: JSON.stringify({
        content: quote,
        context: context === '' ? undefined : context,
        status: notAllowed ? 'NotAllowed' : undefined,
        authors: authors.map(author => ({
          id: author.id,
          expiringAt: undefined
        }))
      }),
      method: 'POST'
    })
    setSubmitting(false)
    if (response.ok) {
      setQuote('')
      setContext('')
      setAuthors([])
      setNotAllowed(false)
      addToast(<SuccessToast content="Das Zitat wurde erfolgreich erstellt!"/>)
    } else {
      addToast(<ErrorToast
        content="Das Zitat konnte nicht erstellt werden. Bitte probiere es erneut oder kontaktiere uns!"
        onRetry={async () => submit()}
      />)
    }
  }

  return (
    <CreateButton
      icon={ChatBubbleOvalLeftEllipsisIcon}
      warnBeforeClosing={modified}
      title="Zitat hinzufügen"
      onClose={() => {
        setInvalidFields([])
      }}
      submitting={submitting}
      submit={submit}
    >
      <div className="col-span-full">
        <label htmlFor="quote" className="block font-medium leading-6 text-neutral-950">
          Zitat:
        </label>
        <div className="mt-1">
          <textarea
            className={clsx(
              "max-h-[40vh] block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset focus:ring-2 focus:ring-inset text-sm !leading-tight",
              invalidFields.includes('quote')
                ? "ring-2 ring-red-500 focus:ring-red-500"
                : "ring-1 ring-neutral-300 focus:ring-neutral-700"
            )}
            onChange={event => {
              setQuote(event.target.value)
              setInvalidFields(invalidFields.filter(invalid => invalid !== 'quote'))
            }}
            value={quote}
            name="quote"
            id="quote"
            rows={5}
          />
        </div>
        {invalidFields.includes('quote') && (
          <p className="mt-1 text-sm text-red-600">
            Bitte gib ein Zitat ein!
          </p>
        )}
      </div>
      <div className="mt-4 col-span-full">
        <label htmlFor="context" className="block font-medium leading-6 text-neutral-950">
          Kontext
          <span className="text-sm text-neutral-500"> (Optional)</span>
          :
        </label>
        <div className="mt-1">
          <input
            className="block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-neutral-700 text-sm !leading-tight"
            onChange={event => setContext(event.target.value)}
            value={context}
            name="context"
            id="context"
            type="text"
          />
        </div>
      </div>
      <div className="relative mt-4 col-span-full">
        <label htmlFor="authors" className="block font-medium leading-6 text-neutral-950">
          Zitierte Personen:
        </label>
        <AuthorsInput
          multiple={true}
          invalid={invalidFields.includes('authors')}
          authors={authors}
          setAuthors={setAuthors}
          onInput={() => setInvalidFields(invalidFields.filter(invalid => invalid !== 'authors'))}
        />
      </div>
      <div className="mt-4 sm:mt-12 col-span-full relative flex gap-x-2">
        <div className="flex h-6 items-center">
        <input
            className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-neutral-950 focus:ring-neutral-700"
            onChange={event => setNotAllowed(event.target.checked)}
            defaultChecked={notAllowed}
            name="not-allowed"
            id="not-allowed"
            type="checkbox"
          />
        </div>
        <div className="leading-6">
          <label htmlFor="not-allowed" className="font-medium cursor-pointer text-gray-900">
            Nicht erlaubt
          </label>
          <p className="text-sm text-neutral-500">
            Gibt an, ob das Zitat als unangemessen bewertet wurde.
          </p>
        </div>
      </div>
    </CreateButton>
  )
}