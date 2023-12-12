'use client'

import './dashboard.css'
import React, {Fragment, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {
  Bars3Icon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import {Logomark} from "@/components/Logo"
import Link from 'next/link'
import {usePathname} from 'next/navigation'

const navigation = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Zitate',
    path: '/dashboard/quotes',
    icon: UsersIcon
  },
  {
    name: 'Kommentare',
    path: '/dashboard/comments',
    icon: FolderIcon
  }
]

function NavigationList({className, children}: {
  className?: string
  children?: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className={clsx(
      "flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6",
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
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
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

function Profile({className, includeName = true}: {
  className?: string
  includeName?: boolean
}) {
  // TODO: Update image
  return (
    <Link href="#" className={className}>
      <span className="sr-only">Your profile</span>
      <img
        className="h-8 w-8 rounded-full bg-gray-800"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
      <span className={includeName ? "" : "hidden"} aria-hidden="true">Tom Cook</span>
    </Link>
  )
}

export default function Layout({children}: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
            <div className="fixed inset-0 bg-gray-900/80"/>
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
                {/* Sidebar component */}
                <NavigationList className="pb-2 ring-1 ring-white/10"/>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div
        className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden"
      >
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          Dashboard
        </div>
        <Profile includeName={false}/>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <NavigationList>
          <li className="-mx-6 mt-auto">
            <Profile
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
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