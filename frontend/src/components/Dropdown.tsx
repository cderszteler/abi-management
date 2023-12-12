import React, {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import clsx from 'clsx'

export type DropdownDirection = 'up' | 'down'

type DropdownItem = {
  icon: (active: boolean) => React.ReactElement<SVGSVGElement>
  content: (active: boolean) => React.ReactElement<HTMLSpanElement>
  onClick: () => void
}

type DropdownGroup = {
  items: DropdownItem[]
}

interface DropdownProperties {
  groups: DropdownGroup[]
  children: React.ReactNode
  direction?: DropdownDirection
  buttonClassName?: string
  className?: string
  invert?: boolean
}

export default function Dropdown({direction = 'up', invert, ...properties}: DropdownProperties) {
  return (
    <Menu
      as="div"
      className={clsx(
        "relative inline-block text-left",
        properties.className
      )
    }>
      <Menu.Button className={properties.buttonClassName}>
        {properties.children}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={clsx(
          "absolute right-0 z-10 mx-2 w-56 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-opacity-5 focus:outline-none",
          invert ? 'divide-neutral-950 ring-white' : 'divide-neutral-100 ring-neutral-950',
          direction === "up" ? "bottom-full mb-2" : "mt-2"
        )}>
          {properties.groups.map((group, index) => {
            return (
              <div
                key={`group-${index}`}
                className={clsx(
                  properties.groups.length > 1 ? "py-1" : "rounded-b-md lg:rounded-none",
                  invert ? 'bg-neutral-950' : ''
                )}
              >
                {group.items.map((item, index) => {
                  // noinspection JSDeprecatedSymbols
                  return (
                    <Menu.Item key={`item-${index}`}>
                      {({active}) => {
                        const icon = item.icon(active)

                        return (
                          <button
                            onClick={item.onClick}
                            className={clsx(
                              invert
                                ? active ? 'bg-neutral-800 text-white' : 'text-neutral-300'
                                : active ? 'bg-neutral-300 text-neutral-950' : 'text-neutral-700',
                              'group flex items-center px-4 py-2 text-sm w-full rounded-md'
                            )}
                          >
                            {React.cloneElement(
                              icon,
                              {
                                className: clsx(
                                  "mr-3 h-5 w-5",
                                  invert
                                    ? 'text-neutral-300 hover:text-white'
                                    : 'text-gray-400 group-hover:text-gray-500',
                                  icon.props.className
                                ),
                                // @ts-ignore
                                "aria-hidden": "true"
                              }
                            )}
                            {item.content(active)}
                          </button>
                        )
                      }}
                    </Menu.Item>
                  )
                })}
              </div>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}