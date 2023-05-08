import { HomeModernIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DesktopSidebar from './DesktopSidebar'
import Header from './Header'
import MobileSidebar from './MobileSidebar'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Squares2X2Icon,
    current: true
  },
  {
    name: 'Hotels',
    href: '/dashboard/hotels',
    icon: HomeModernIcon,
    current: false
  }
]
const userNavigation = [
  { name: 'Account settings', href: 'settings/account' },
  { name: 'Support', href: '#' }
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div>
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
        />

        {/* Static sidebar for desktop */}
        <DesktopSidebar navigation={navigation} />

        <div className="lg:pl-72">
          <Header
            setSidebarOpen={setSidebarOpen}
            userNavigation={userNavigation}
          />

          <main className="py-10">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
