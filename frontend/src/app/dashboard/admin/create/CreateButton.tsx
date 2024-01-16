'use client'

import {HomeIcon, XMarkIcon} from "@heroicons/react/24/outline"
import {Modal} from "@/components/Modal";
import {useContext, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {CenteredLoading} from "@/components/Loading";
import {DisplayUsersContext} from "@/app/dashboard/admin/create/CreateButtons";

export default function CreateButton({title, onClose, submitting, keepOpen, ...props}:
{
  title: string
  icon: typeof HomeIcon
  warnBeforeClosing: boolean
  onClose: (() => void) | undefined
  keepOpen?: boolean
  submitting: boolean
  submit: () => Promise<void>
  children: React.ReactNode
}) {
  const users = useContext(DisplayUsersContext)
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

  useEffect(() => {
    if (!submitting && !keepOpen) {
      setOpen(false)
    }
  }, [submitting, keepOpen]);

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
        <h3
          className="mb-3 sm:mt-5 text-xl font-semibold leading-10 text-neutral-950">
          {title}
        </h3>
        <form>
          {props.children}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              className={clsx(
                "inline-flex w-full sm:w-auto justify-center items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm transition",
                submitting
                  ? "cursor-not-allowed bg-green-400"
                  : "bg-green-500 hover:bg-green-400"
              )}
              onClick={async event => {
                event.preventDefault()
                await props.submit()
              }}
              disabled={submitting}
              type="submit"
            >
              {submitting && (
                <CenteredLoading className="w-4 mr-2 fill-neutral-500"/>
              )}
              Hinzufügen
            </button>
          </div>
        </form>
      </Modal>
      <div className={clsx(
        "h-full max-h-80 border-2 border-dashed rounded-3xl border-neutral-900/25 transition",
        users.length !== 0 ? "hover:scale-105" : ""
      )}>
        <button
          className={clsx(
            "w-full h-full p-2 sm:p-4 flex flex-col items-center justify-center gap-y-4 sm:gap-y-8 focus:rounded-3xl",
            users.length === 0 ? "cursor-not-allowed" : ""
          )}
          onClick={event => {
            event.preventDefault()
            if (users.length !== 0) {
              setOpen(true)
            }
          }}
        >
          <props.icon className="w-16 text-neutral-300"/>
          <span className="font-display text-3xl text-neutral-600">
            {title}
          </span>
        </button>
      </div>
    </>
  )
}