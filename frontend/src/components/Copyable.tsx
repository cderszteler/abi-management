'use client'

import clsx from "clsx";

// TODO: Implement
export function Copyable({children, content, className}: {
  children: React.ReactNode
  content?: string
  className?: string
}) {
  const toCopy = children instanceof String
    ? children
    : content
  
  return (
    <>
      <span className={clsx("cursor-pointer", className)}>
        {children}
      </span>
    </>
  )
}