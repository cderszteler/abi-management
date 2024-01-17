import {Listbox, Transition} from "@headlessui/react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import {Dispatch, Fragment, SetStateAction, useMemo} from "react"

export type ListType = 'quote' | 'comment'

type DisplayType = {
  type: ListType
  display: string
}
const values: DisplayType[] = [
  {
    type: 'quote',
    display: 'Zitate'
  },
  {
    type: 'comment',
    display: 'Kommentare'
  }
]

export function TypeSelector({type, setType}:
{
  type: ListType | undefined
  setType: Dispatch<SetStateAction<ListType | undefined>>
}) {
  const selected = useMemo(() => {
    const filtered = values.filter(value => value.type === type)
    if (filtered.length === 0) {
      return undefined
    }
    return filtered[0]
  }, [type])

  return (
    <Listbox
      value={selected}
      onChange={(selected: DisplayType) => {
        setType(selected.type)
      }}
      name="types"
    >
      {({open}) => (
        <div className="relative min-w-40 sm:min-w-52 md:min-w-72 max-w-72">
          <Listbox.Button className={clsx(
            "relative w-full min-h-[29.5px] pl-3 pr-10 py-1.5 text-left text-neutral-950 !leading-tight cursor-pointer",
            "rounded-md border-0 ring-1 ring-neutral-300 ring-inset focus:ring-2 focus:ring-inset focus:ring-neutral-700 shadow-sm"
          )}>
            <span className="block truncate">{selected?.display}</span>
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              {open
                ? (<ChevronUpIcon className="h-5 w-5 text-neutral-400" aria-hidden="true"/>)
                : (<ChevronDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true"/>)
              }
            </span>
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
              {values.map((value, index) => (
                <Listbox.Option
                  key={index}
                  value={value}
                  className={({active}) => clsx(
                    "relative cursor-pointer px-4 py-1 transition duration-75",
                    active ? "bg-neutral-100 text-neutral-950" : "text-neutral-700",
                    index + 1 !== values.length ? "border border-x-0 border-t-0 border-b-neutral-200" : ""
                  )}
                >
                  {({selected}) => (
                    <>
                      <span className={clsx(
                        "block truncate",
                        selected ? 'font-medium' : 'font-normal'
                      )}>
                        {value.display}
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
        </div>
      )}
    </Listbox>
  )
}