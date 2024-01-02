'use client'

import {Button} from "@/app/dashboard/admin/create/CreateButtons";
import {Fragment, useEffect, useRef, useState} from "react";
import {Modal} from "@/components/Modal";
import {PencilSquareIcon, XMarkIcon} from "@heroicons/react/24/outline";

import {User} from "@/lib/auth";
import clsx from "clsx";
import AuthorsInput from "@/app/dashboard/admin/create/AuthorsInput";

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
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (comment || authors.length != 0) {
        event.preventDefault();
      }
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [comment, authors]);

  const submit = async () => {
    const invalidFields = validateFields(comment, authors)
    if (invalidFields.length !== 0) {
      setInvalidFields(invalidFields)
      return
    }
  }

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        onClose={() => setInvalidFields([])}
        initialFocus={closeButtonRef}
      >
        <div className="absolute left-0 top-0 hidden pl-5 pt-4 sm:block">
          <PencilSquareIcon className="w-6 text-neutral-500"/>
        </div>
        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
          <button
            className="rounded-md bg-white text-neutral-400 hover:text-neutral-500 transition"
            onClick={() => setOpen(false)}
            ref={closeButtonRef}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
          </button>
        </div>
        <h3 className="mb-3 sm:mt-5 text-xl font-semibold leading-10 text-neutral-950">
          Kommentar hinzufügen
        </h3>
        <form>
          <div className="col-span-full">
            <label htmlFor="comment" className="block font-medium leading-6 text-neutral-950">
              Kommentar:
            </label>
            <div className="mt-1">
              <textarea
                className={clsx(
                  "block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset focus:ring-2 focus:ring-inset text-sm !leading-tight",
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
          <div className="mt-12 sm:flex sm:flex-row-reverse">
            <button
              className="inline-flex w-full sm:w-auto justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 transition"
              onClick={async event => {
                event.preventDefault()
                await submit()
              }}
              type="submit"
            >
              Hinzufügen
            </button>
          </div>
        </form>
      </Modal>
      <Button
        icon={PencilSquareIcon}
        onClick={() => setOpen(true)}
        content="Kommentar hinzufügen"
      />
    </>
  )
}