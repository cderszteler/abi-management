'use client'

import {HomeIcon, XMarkIcon} from "@heroicons/react/24/outline"
import {Modal} from "@/components/Modal";
import {Button} from "@/app/dashboard/admin/create/CreateButtons";
import {useEffect, useRef, useState} from "react";

export default function CreateButton({title, submit, onClose, children, ...props}:
{
  title: string
  icon: typeof HomeIcon
  warnBeforeClosing: boolean
  onClose: (() => void) | undefined
  submit: () => Promise<void>
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (props.warnBeforeClosing) {
        event.preventDefault();
      }
    }

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [props.warnBeforeClosing]);

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        onClose={() => {
          if (onClose) {
            onClose()
          }
        }}
        initialFocus={closeButtonRef}
      >
        <div className="absolute left-0 top-0 hidden pl-5 pt-4 sm:block">
          <props.icon className="w-6 text-neutral-500"/>
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
          {title}
        </h3>
        <form>
          {children}
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
        icon={props.icon}
        onClick={() => setOpen(true)}
        content={title}
      />
    </>
  )
}