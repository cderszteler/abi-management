'use client'

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useMemo,
  useState
} from "react";
import {Combobox, Transition} from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  DisplayUser,
  DisplayUsersContext
} from "@/app/dashboard/admin/create/CreateButtons";

type AuthorsType = DisplayUser[] | (DisplayUser | undefined)

export default function AuthorsInput<Type extends AuthorsType>(
{
  multiple,
  invalid,
  authors,
  setAuthors,
  onInput
}: {
  multiple: boolean
  invalid: boolean
  authors: Type
  setAuthors: Dispatch<SetStateAction<Type>>
  onInput?: (() => void) | undefined
}) {
  const users = useContext(DisplayUsersContext)
  const [query, setQuery] = useState('')

  const filteredAuthors = query !== ''
    ? users
      .filter((user) => user.displayName.toLowerCase().includes(query.toLowerCase()))
    : users

  const selectedAuthorsName: string = useMemo(() => {
    if (Array.isArray(authors)) {
      const enumerated = authors.map((author) => author.displayName).join(", ")
      if (enumerated.length > 35) {
        return enumerated.substring(0, 32) + `... (${authors.length})`
      }
      return enumerated
    } else {
      return authors?.displayName || ''
    }
  }, [authors])

  return (
    <>
      <label htmlFor="authors" className="block font-medium leading-6 text-neutral-950">
        Zitierte Personen:
      </label>
      <Combobox
        value={authors}
        onChange={(authors) => {
          setAuthors(authors)
          if (onInput) {
            onInput()
          }
        }}
        // @ts-ignore
        multiple={multiple}
        name="authors"
      >
        {({open}) => (
          <>
            <div
              className="relative min-h-[29.5px] w-full mt-1 cursor-pointer text-neutral-950 shadow-sm">
              <Combobox.Input
                className={clsx(
                  "w-full pl-3 pr-10 py-1.5 text-left rounded-md border-0 ring-inset focus:ring-2 focus:ring-inset text-sm !leading-tight",
                  invalid
                    ? "ring-2 ring-red-500 focus:ring-red-500"
                    : "ring-1 ring-neutral-300 focus:ring-neutral-700"
                )}
                onChange={(event) => setQuery(event.target.value)}
                displayValue={() => selectedAuthorsName}
              />
              <Combobox.Button
                className="absolute inset-y-0 right-0 flex items-center pr-2">
                {open
                  ? (<ChevronUpIcon className="h-5 w-5 text-neutral-400"
                                    aria-hidden="true"/>)
                  : (<ChevronDownIcon className="h-5 w-5 text-neutral-400"
                                      aria-hidden="true"/>)
                }
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-75"
              leave="transition ease-in duration-75"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className={clsx(
                "absolute mt-1 max-h-28 sm:max-h-40 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-neutral-200 z-50",
                "scrollbar scrollbar-w-1.5 scrollbar-h-1.5 scrollbar-track-neutral-100 scrollbar-track-rounded-full scrollbar-thumb-neutral-300 scrollbar-thumb-rounded-full"
              )}>
                {filteredAuthors.length === 0 && query !== '' && (
                  <div
                    className="relative cursor-default select-none px-4 py-1 text-red-500">
                    Es konnte keine passende Person gefunden werden.
                  </div>
                )}
                {filteredAuthors.map((user, index) => (
                  <Combobox.Option
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
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </>
        )}
      </Combobox>
      {invalid && (
        <p className="mt-1 text-sm text-red-600">
          Bitte wähl mindestens eine zitierte Person aus!
        </p>
      )}
    </>
  )
}