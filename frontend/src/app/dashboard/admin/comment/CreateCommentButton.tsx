'use client'

import {useContext, useMemo, useState} from "react";
import {PencilSquareIcon} from "@heroicons/react/24/outline";

import {RootLayoutContext} from "@/components/RootLayout";
import {User} from "@/lib/auth";
import clsx from "clsx";
import AuthorsInput from "@/components/AuthorsInput";
import {ErrorToast, SuccessToast} from "@/components/Toast";
import {mutator} from "@/lib/backend";
import useSWRMutation from "swr/mutation";
import {SmallCreateButton} from "@/components/admin/CreateButton";

type RequiredFields = 'comment' | 'user'

function validateFields(comment: string, user: User | undefined): RequiredFields[] {
  const invalidFields: RequiredFields[] = []
  if (!comment) {
    invalidFields.push('comment')
  }
  if (!user) {
    invalidFields.push('user')
  }
  return invalidFields
}

export default function CreateCommentButton() {
  const {addToast} = useContext(RootLayoutContext)!
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/v1/comment',
    mutator,
    { throwOnError: false, onSuccess: () => onSuccess(), onError: () => onError()}
  )
  const [comment, setComment] = useState('')
  const [user, setUser] = useState<User | undefined>()
  const [invalidFields, setInvalidFields] = useState<RequiredFields[]>([])

  const modified = useMemo(
    () => !!(comment || user),
    [comment, user]
  )

  const submit = async () => {
    const invalidFields = validateFields(comment, user)
    if (invalidFields.length !== 0) {
      setInvalidFields(invalidFields)
      return
    }
    trigger({content: comment, userId: user?.id})
  }
  const onSuccess = () => {
    setComment('')
    setUser(undefined)
    addToast(<SuccessToast content="Der Kommentar wurde erfolgreich erstellt!"/>)
  }
  const onError = () => {
    addToast(<ErrorToast
      content="Der Kommentar konnte nicht erstellt werden. Bitte probiere es erneut oder kontaktiere uns!"
      onRetry={async () => submit()}
    />)
  }

  return (
    <SmallCreateButton
      title="Kommentar hinzufügen"
      icon={PencilSquareIcon}
      warnBeforeClosing={modified}
      onClose={() => setInvalidFields([])}
      keepOpen={isMutating || error}
      submitting={isMutating}
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
        <label htmlFor="authors" className="block font-medium leading-6 text-neutral-950">
          Adressat:
        </label>
        <AuthorsInput
          multiple={false}
          invalid={invalidFields.includes('user')}
          authors={user}
          setAuthors={setUser}
          onInput={() => setInvalidFields(invalidFields.filter(invalid => invalid !== 'user'))}
        />
      </div>
    </SmallCreateButton>
  )
}