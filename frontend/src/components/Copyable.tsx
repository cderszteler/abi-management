'use client'

import clsx from "clsx";
import {Tooltip} from "@/components/Tooltip";
import {useMemo} from "react";
import {ClipboardIcon} from "@heroicons/react/24/outline";

export function Copyable({children, content, className}: {
  children: React.ReactNode
  content?: string
  className?: string
}) {
  const toCopy = useMemo(() => {
    return content
      ? content
      : children?.toString()
  }, [children, content])

  return (
    <>
      <Tooltip
        className="!text-green-600"
        content={(
          <div className="flex items-center gap-x-2">
            <ClipboardIcon className="h-4"/>
            Kopiert!
          </div>
        )}
        trigger='click'
        onClick={async () => {
          if (toCopy) {
            await navigator.clipboard.writeText(toCopy)
          }
        }}
      >
        <span className={clsx("cursor-pointer", className)}>
          {children}
        </span>
      </Tooltip>
    </>
  )
}