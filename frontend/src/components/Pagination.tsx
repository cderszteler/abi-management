import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {SetStateAction, useMemo} from 'react'

export default function Pagination({total, page, setPage, className}: {
  page: number
  setPage: React.Dispatch<SetStateAction<number>>
  total: number
  className?: string
}) {
  const pages = useMemo(() => {
    const pages = []

    for (let current = 1; current <= total; current++) {
      if (current <= 2 || current >= total - 1 || total === 5 || current === page) {
        pages.push(
          <Page key={current - 1} number={current} page={page} setPage={setPage}/>
        )
        continue
      }
      pages.push(<Separator key={current - 1}/>)
      current = current < page
        ? Math.min(page - 1, total - 2)
        : total - 2
    }
    return pages
  }, [page, setPage, total])

  return (
    <nav className={clsx(
      "flex items-center justify-between px-4 sm:px-0",
      className
    )}>
      <div className="-mt-px flex w-0 flex-1">
        <Arrow
          disabled={page <= 1}
          onClick={() => {
            setPage(page - 1)
          }}
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-gray-400 group-disabled:text-gray-300 transition duration-100"
            aria-hidden="true"
          />
          Vorherige
        </Arrow>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pages}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Arrow
          disabled={page >= total}
          onClick={() => {
            setPage(page + 1)
          }}
        >
          Nächste
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400 group-disabled:text-gray-300 transition duration-100"
            aria-hidden="true"
          />
        </Arrow>
      </div>
    </nav>
  )
}

function Arrow({disabled, onClick, children}: {
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className={clsx(
        "group inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium transition duration-100",
        "text-gray-500 hover:border-gray-300 hover:text-gray-700",
        "disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:border-gray-200"
      )}
      onClick={event => {
        event.preventDefault()
        onClick()
      }}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function Page({number, page, setPage}: {
  number: number
  page: number
  setPage: React.Dispatch<SetStateAction<number>>
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium",
        page === number
          ? "border-neutral-800 text-neutral-950"
          : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
      )}
      onClick={event => {
        event.preventDefault()
        setPage(number)
      }}
    >
      {number}
    </button>
  )
}

function Separator() {
  return (
    <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-neutral-500 cursor-default">
      ...
    </span>
  )
}