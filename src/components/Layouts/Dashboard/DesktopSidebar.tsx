import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'

import { Logo } from 'assets/Logo'
import type { INavigationItem } from './types'

interface DesktopSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  navigation: INavigationItem[]
}

export default function DesktopSidebar(props: DesktopSidebarProps) {
  const { navigation } = props
  const { pathname } = useLocation()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Logo className="h-12 w-auto" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        pathname === item.href
                          ? 'bg-gray-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                      )}
                    >
                      <item.icon
                        className={clsx(
                          pathname === item.href
                            ? 'text-blue-600'
                            : 'text-gray-400 group-hover:text-blue-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* <li className="mt-auto">
              <a
                href="#"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <Cog6ToothIcon
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                  aria-hidden="true"
                />
                Settings
              </a>
            </li> */}
          </ul>
        </nav>
      </div>
    </div>
  )
}
