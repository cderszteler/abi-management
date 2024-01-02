'use client'

import {useMemo, useState} from "react";
import {PencilSquareIcon} from "@heroicons/react/24/outline";

import {User} from "@/lib/auth";
import clsx from "clsx";
import AuthorsInput from "@/app/dashboard/admin/create/AuthorsInput";
import CreateButton from "@/app/dashboard/admin/create/CreateButton";

type RequiredFields = 'comment' | 'authors'

function validateFields(comment: string, authors: User[]): RequiredFields[] {
  const invalidFields: RequiredFields[] = []
  if (!comment) {
    invalidFields.push('comment')
  }
  if (authors.length === 0) {
    invalidFields.push('authors')
  }
  return invalidFields
}

export default function AddCommentButton() {
  const [comment, setComment] = useState('')
  const [authors, setAuthors] = useState<User[]>([])

  const [invalidFields, setInvalidFields] = useState<RequiredFields[]>([])

  const modified = useMemo(
    () => !!(comment || authors.length != 0),
    [comment, authors]
  )

  const submit = async () => {
    const invalidFields = validateFields(comment, authors)
    if (invalidFields.length !== 0) {
      setInvalidFields(invalidFields)
      return
    }
  }

  return (
    <CreateButton
      title="Kommentar hinzufügen"
      icon={PencilSquareIcon}
      warnBeforeClosing={modified}
      onClose={() => setInvalidFields([])}
      submit={submit}
    >
      <div className="col-span-full">
        <label htmlFor="comment" className="block font-medium leading-6 text-neutral-950">
          Kommentar:
        </label>
        <div className="mt-1">
          <textarea
            className={clsx(
              "max-h-[40vh] block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset focus:ring-2 focus:ring-inset text-sm !leading-tight",
              invalidFields.includes('comment')
                ? "ring-2 ring-red-500 focus:ring-red-500"
                : "ring-1 ring-neutral-300 focus:ring-neutral-700"
            )}
            onChange={event => {
              setComment(event.target.value)
              setInvalidFields(invalidFields.filter(invalid => invalid !== 'comment'))
            }}
            value={comment}
            name="comment"
            id="comment"
            rows={5}
          />
        </div>
        {invalidFields.includes('comment') && (
          <p className="mt-1 text-sm text-red-600">
            Bitte gib einen Kommentar ein!
          </p>
        )}
      </div>
      <div className="relative mt-4 col-span-full">
        <AuthorsInput
          invalid={invalidFields.includes('authors')}
          authors={authors}
          setAuthors={setAuthors}
          onInput={() => setInvalidFields(invalidFields.filter(invalid => invalid !== 'authors'))}
        />
      </div>
    </CreateButton>
  )
}