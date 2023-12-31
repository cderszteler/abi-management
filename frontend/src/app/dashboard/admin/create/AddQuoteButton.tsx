'use client'

import {Button} from "@/app/dashboard/admin/create/CreateButtons";
import {useRef, useState} from "react";
import {Modal} from "@/components/Modal";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// TODO: Browser-Alert when closing tab with values
// TODO: Add validation + error fields
export default function AddQuoteButton() {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef(null)

  // TODO: Conditional depending on values
  window.addEventListener("beforeunload", event => {
    event.preventDefault();
    return event.returnValue = 'Du hast noch ein ungespeichertes Zitate!';
  });

  return (
    <>
      <Modal open={open} setOpen={setOpen} initialFocus={closeButtonRef}>
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
            <label htmlFor="about" className="block font-medium leading-6 text-neutral-950">
              Zitat:
            </label>
            <div className="mt-1">
              <textarea
                className="block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-neutral-700 text-sm !leading-tight"
                name="about"
                id="about"
                rows={5}
              />
            </div>
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
                name="context"
                id="context"
                type="text"
              />
            </div>
          </div>
          {/* TODO: Allow to select multiple authors */}
          <div className="mt-4 col-span-full">
            <label htmlFor="context" className="block font-medium leading-6 text-neutral-950">
              Zitierte Personen:
            </label>
            <div className="mt-1">
              <select
                className="block w-full rounded-md border-0 py-1.5 text-neutral-950 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-neutral-700 text-sm !leading-tight"
                name="authors"
                id="authors"
              >

              </select>
            </div>
          </div>
          <div className="mt-4 col-span-full relative flex gap-x-2">
            <div className="flex h-6 items-center">
              <input
                className="h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-700"
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
              onClick={event => {
                event.preventDefault()
                setOpen(false)
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