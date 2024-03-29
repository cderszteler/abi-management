'use client'

import {hasRoles, Role} from "@/lib/auth";
import {Logomark} from "@/components/Logo";
import {Fragment, useContext, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import Dropdown, {DropdownDirection} from "@/components/Dropdown";
import {Dialog, Transition} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  UserIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import {signOut} from "next-auth/react";
import {DashboardContext} from "./DashboardContextProvider";
import {PillWithBorder} from "@/components/Badge";

type NavigationPath = {
  name: string
  path: string
  icon: typeof HomeIcon
}

const navigation: NavigationPath[] = [
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

const adminNavigation: (NavigationPath & {roles: Role[]})[] = [
  {
    name: "Hinzufügen",
    path: "/dashboard/admin/create",
    icon: PlusCircleIcon,
    roles: ['Moderator', 'Admin']
  },
  {
    name: "Zitate",
    path: "/dashboard/admin/quote",
    icon: ChatBubbleOvalLeftEllipsisIcon,
    roles: ['Moderator', 'Admin']
  },
  {
    name: "Kommentare",
    path: "/dashboard/admin/comment",
    icon: PencilSquareIcon,
    roles: ['Moderator', 'Admin']
  }
]

function Items({className, children}: {
  className?: string
  children?: React.ReactNode
}) {
  const context = useContext(DashboardContext)
  const [logoHovered, setLogoHovered] = useState(false)
  const pathname = usePathname()

  const userRoles = context?.user?.roles
  const isModerator = hasRoles(userRoles, ['Moderator'])
  const isAdmin = hasRoles(userRoles, ['Admin'])

  return (
    <div className={clsx(
      "flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-950 px-6",
      className
    )}>
      <div className="flex h-16 shrink-0 items-center">
        <Link
          href="/"
          aria-label="Homepage"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <Logomark className="h-8 w-auto" filled={logoHovered} invert/>
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
          {(isAdmin || isModerator) && (
            <li>
              <div className="text-xs font-semibold leading-6 text-neutral-300">
                {isAdmin ? "Admin Dashboard" : "Moderator Dashboard"}
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {adminNavigation.map((item) => hasRoles(userRoles, item.roles) && (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={clsx(
                        item.path === pathname
                          ? 'bg-gray-800 text-white'
                          : 'text-neutral-300 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0 text-white" aria-hidden="true"/>
                      {item.name}
                      <PillWithBorder className="bg-gray-900/60 text-gray-400 ring-gray-500/10">
                        Verwaltung
                      </PillWithBorder>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
          {children}
        </ul>
      </nav>
    </div>
  )
}

function Profile({className, isLoading = false, includeName = true, dropdownDirection}: {
  className?: string
  isLoading?: boolean
  includeName?: boolean
  dropdownDirection?: DropdownDirection
}) {
  const context = useContext(DashboardContext)

  return (
    <Dropdown
      groups={[
        {
          items: [
            {
              icon: ((active) => <ArrowLeftStartOnRectangleIcon
                className={clsx("w-6", active ? 'text-red-600' : 'text-red-500')}
              />),
              content: ((active) => (
                <span
                  className={clsx(
                    "text-base",
                    active ? 'text-red-600' : 'text-red-500'
                  )}
                >
                  Abmelden
                </span>
              )),
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
        {includeName && (
          <span aria-hidden="true">
            {isLoading && (
              <div className="animate-pulse w-32 h-2 bg-neutral-300 rounded-md"/>
            )}
            {!isLoading && context?.user?.displayName}
          </span>
        )}
      </div>
    </Dropdown>
  )
}

function Footer({className}: {className?: string}) {
  // noinspection HtmlUnknownTarget
  return (
    <li className={clsx(
      "text-sm font-semibold text-neutral-500",
      className
    )}>
      <Link href="/contact" className="block hover:text-neutral-300 transition">
        Kontakt
      </Link>
      <Link href="/imprint" className="block hover:text-neutral-300 transition">
        Impressum
      </Link>
    </li>
  )
}

export default function DashboardNavigation() {
  const { isLoading } = useContext(DashboardContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname]);

  return (
    <>
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
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
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
                <Items className="pb-2 ring-1 ring-white/10">
                  <Footer/>
                </Items>
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
        <Items>
          <Footer className="mb-0 mt-auto"/>
          <li className="-mx-6">
            <Profile
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-neutral-800"
              isLoading={isLoading}
            />
          </li>
        </Items>
      </div>
    </>
  )
}