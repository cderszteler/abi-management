'use client'

import './dashboard.css'
import React, {Fragment, useEffect, useMemo, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {Logomark} from "@/components/Logo"
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import Dropdown, {DropdownDirection} from "@/components/Dropdown";
import {signOut, useSession} from 'next-auth/react'
import {UserIcon} from '@heroicons/react/20/solid'

const navigation = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Zitate',
    path: '/dashboard/quotes',
    icon: ChatBubbleOvalLeftEllipsisIcon
  },
  {
    name: 'Kommentare',
    path: '/dashboard/comments',
    icon: PencilSquareIcon
  }
]

function NavigationList({className, children}: {
  className?: string
  children?: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className={clsx(
      "flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-950 px-6",
      className
    )}>
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/" aria-label="Homepage">
          <Logomark className="h-8 w-auto" invert/>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={clsx(
                      item.path === pathname
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition duration-100'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true"/>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {children}
        </ul>
      </nav>
    </div>
  )
}

function Profile({className, includeName = true, dropdownDirection}: {
  className?: string
  includeName?: boolean,
  dropdownDirection?: DropdownDirection
}) {
  const {data: session} = useSession()
  const displayName: string = useMemo(() => {
    if (session) {
      // @ts-ignore
      return session?.user?.displayName
    }
    return ""
  }, [session])

  return (
    <Dropdown
      groups={[
        {
          items: [
            {
              icon: ((active) => <ArrowLeftOnRectangleIcon
                className={clsx("w-6", active ? 'text-red-600' : 'text-red-500')}
              />),
              content: ((active) =>
                <span
                  className={clsx(
                    "text-base",
                    active ? 'text-red-600' : 'text-red-500'
                  )}
                >
                  Abmelden
                </span>
              ),
              onClick: () => {signOut()}
            }
          ]
        }
      ]}
      className={className ? "h-full w-full" : ""}
      buttonClassName={className ? "h-full w-full" : ""}
      direction={dropdownDirection}
      invert
    >
      <div className={className}>
        <span className="sr-only">Your profile</span>
        <UserIcon
          className="h-8 w-8 rounded-full text-white"
        />
        <span className={includeName ? "" : "hidden"} aria-hidden="true">
          {displayName}
        </span>
      </div>
    </Dropdown>
  )
}

export default function Layout({children}: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname]);

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-950/80"/>
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel
                className="relative mr-12 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                    </button>
                  </div>
                </Transition.Child>
                <NavigationList className="pb-2 ring-1 ring-white/10"/>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-neutral-950 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-neutral-300 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          Dashboard
        </div>
        <Profile includeName={false} dropdownDirection='down'/>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <NavigationList>
          <li className="-mx-6 mt-auto">
            <Profile
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-neutral-800"
            />
          </li>
        </NavigationList>
      </div>

      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}