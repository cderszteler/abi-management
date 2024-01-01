'use client'

import {Button} from "@/app/dashboard/admin/create/CreateButtons";
import {Fragment, useEffect, useMemo, useRef, useState} from "react";
import {Modal} from "@/components/Modal";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import {Listbox, Transition} from "@headlessui/react";
import {User} from "@/lib/auth";
import clsx from "clsx";

// TODO: Fetch
const users: User[] = [
  {
    id: 1,
    roles: [],
    displayName: 'Christoph Derszteler'
  },
  {
    id: 2,
    roles: [],
    displayName: 'S. P.'
  },
  {
    id: 5,
    roles: [],
    displayName: 'A. B.'
  },
  {
    id: 4,
    roles: [],
    displayName: 'John Doe'
  },
  {
    id: 3,
    roles: [],
    displayName: 'H. K.'
  },
]

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
  const [quote, setQuote] = useState('')
  const [context, setContext] = useState('')
  const [authors, setAuthors] = useState<User[]>([])
  const [notAllowed, setNotAllowed] = useState(false)
  const [invalidFields, setInvalidFields] = useState<RequiredFields[]>([])
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (quote || context || authors.length != 0 || notAllowed) {
        event.preventDefault();
      }
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [quote, context, authors, notAllowed]);

  const selectedAuthors = useMemo(() => {
    const enumerated = authors.map((author) => author.displayName).join(", ")
    if (enumerated.length > 35) {
      return enumerated.substring(0, 32) + `... (${authors.length})`
    }
    return enumerated
  }, [authors])

  const submit = async () => {
    const invalidFields = validateFields(quote, authors)
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
          <ChatBubbleOvalLeftEllipsisIcon className="w-6 text-neutral-500"/>
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
          Zitat hinzufügen
        </h3>
        <form>
          <div className="col-span-full">
            <label htmlFor="quote" className="block font-medium leading-6 text-neutral-950">
              Zitat:
            </label>
            <div className="mt-1">
              <textarea
                className={clsx(
                  "block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset focus:ring-2 focus:ring-inset text-sm !leading-tight",
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
          {/*TODO: Text input to search/filter*/}
          <div className="relative mt-4 col-span-full">
            <label htmlFor="authors" className="block font-medium leading-6 text-neutral-950">
              Zitierte Personen :
            </label>
            <Listbox
              value={authors}
              onChange={(authors) => {
                setAuthors(authors)
                setInvalidFields(invalidFields.filter(invalid => invalid !== 'authors'))
              }}
              multiple={true}
              name="authors"
            >
              <Listbox.Button className={clsx(
                "relative min-h-[29.5px] w-full mt-1 pl-3 pr-10 text-left cursor-pointer rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-inset focus:ring-2 focus:ring-inset text-sm !leading-tight",
                invalidFields.includes('authors')
                  ? "ring-2 ring-red-500 focus:ring-red-500"
                  : "ring-1 ring-neutral-300 focus:ring-neutral-700"
              )}>
                {({ open }) => (
                  <>
                    <span className="block truncate">{selectedAuthors}</span>
                    <span
                      className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      {open
                        ? (<ChevronUpIcon className="h-5 w-5 text-neutral-400" aria-hidden="true"/>)
                        : (<ChevronDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true"/>)
                      }
                    </span>
                  </>
                )}
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-75"
                leave="transition ease-in duration-75"
              >
                <Listbox.Options className={clsx(
                  "absolute mt-1 max-h-28 sm:max-h-40 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-neutral-200 z-50",
                  "scrollbar scrollbar-w-1.5 scrollbar-h-1.5 scrollbar-track-neutral-100 scrollbar-track-rounded-full scrollbar-thumb-neutral-300 scrollbar-thumb-rounded-full"
                )}>
                  {users.map((user, index) => (
                    <Listbox.Option
                      key={user.id}
                      value={user}
                      className={({active}) => clsx(
                        "relative cursor-pointer px-4 py-1 transition duration-75",
                        active ? "bg-neutral-100 text-neutral-950" : "text-neutral-700",
                        index + 1 !== users.length ? "border border-x-0 border-t-0 border-b-neutral-200" : ""
                      )}
                    >
                      {({selected}) => (
                        <>
                          <span className={clsx(
                            "block truncate",
                            selected ? 'font-medium' : 'font-normal'
                          )}>
                            {user.displayName}
                          </span>
                          {selected && (
                            <span
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-lime-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
            {invalidFields.includes('authors') && (
              <p className="mt-1 text-sm text-red-600">
                Bitte wähl mindestens eine zitierte Person aus!
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-12 col-span-full relative flex gap-x-2">
            <div className="flex h-6 items-center">
              <input
                className="h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-700"
                onChange={event => setNotAllowed(event.target.checked)}
                defaultChecked={notAllowed}
                name="not-allowed"
                id="not-allowed"
                type="checkbox"
              />
            </div>
            <div className="leading-6">
              <label htmlFor="not-allowed" className="font-medium text-gray-900">
                Nicht erlaubt
              </label>
              <p className="text-sm text-neutral-500">
                Gibt an, ob das Zitat als unangemessen bewertet wurde.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
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
        icon={ChatBubbleOvalLeftEllipsisIcon}
        onClick={() => setOpen(true)}
        content="Zitat hinzufügen"
      />
    </>
  )
}