import {Logomark} from "@/components/Logo";
import clsx from "clsx";

export default function Card({
  logo = false,
  title,
  className,
  children
}: {
  logo?: boolean
  title?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logomark
          className={clsx(
            "mx-auto h-10 w-auto",
            !logo ? "hidden" : ""
          )}
        />
        <h2 className={clsx(
          "mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-neutral-950",
          !title ? "hidden" : ""
        )}>
          {title}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className={clsx(
          "bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12",
          className
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}