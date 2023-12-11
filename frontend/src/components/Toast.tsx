'use client'

import {Fragment, useEffect, useState} from 'react'
import {Transition} from '@headlessui/react'
import {XCircleIcon} from '@heroicons/react/24/outline'
import {XMarkIcon} from '@heroicons/react/20/solid'
import {useRouter} from 'next/navigation'

export type Toast = React.ReactElement

export default function ButtonToast({onRemove, autoRemove = true, cooldown = 5000}: {
  onRemove: () => void,
  autoRemove?: boolean
  cooldown?: number
}) {
  const [show, setShow] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!show) {
      onRemove()
    }
    if (show && autoRemove) {
      setTimeout(() => {
        setShow(false)
      }, cooldown)
    }
  }, [cooldown, autoRemove, show, onRemove]);

  return (
    <>
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-3 py-2">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-7 text-red-500" aria-hidden="true"/>
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-neutral-950">Fehler</p>
                <p className="text-sm text-neutral-600">
                  Der Login hat nicht funktioniert. Bitte probiere es erneut oder
                  kontaktiere uns!
                </p>
                <div className="mt-1.5 flex space-x-7">
                  <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="rounded-md bg-white text-sm font-medium text-neutral-950 hover:text-neutral-700"
                  >
                    Erneut versuchen
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/contact")}
                    className="rounded-md bg-white text-sm font-medium text-red-500 hover:text-red-400"
                  >
                    Kontakt
                  </button>
                </div>
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-white text-neutral-400 hover:text-neutral-500"
                  onClick={() => {
                    setShow(false)
                  }}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  )
}