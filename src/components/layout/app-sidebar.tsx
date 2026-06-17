"use client"

import * as React from "react"
import {
  Hexagon,
  Search,
  Bell,
  Calendar,
  Settings,
  ChevronDown,
  Eye,
  Target,
  LayoutGrid,
  Plus
} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

// Example data matching the template
const navMain = [
  { title: "Search", url: "#", icon: Search },
  { title: "Notification", url: "#", icon: Bell, badge: "99+" },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
]

const myPages = [
  { title: "Craftboard Project", url: "/projects", initial: "C", colorClass: "bg-blue-600", icon: null },
  { title: "Visionary Tasks", url: "#", initial: null, colorClass: "bg-gray-800", icon: Eye },
  { title: "Demotion Project", url: "#", initial: null, colorClass: "bg-orange-500", icon: Target },
  { title: "Angular Studio", url: "#", initial: null, colorClass: "bg-blue-400", icon: LayoutGrid, badge: "10" },
  { title: "Cudemo Project", url: "#", initial: "C", colorClass: "bg-purple-600", icon: null },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props} className="w-64 flex-shrink-0 border-r border-border-light dark:border-border-dark flex flex-col bg-surface-light dark:bg-surface-dark">
      {/* User Info Header */}
      <SidebarHeader className="p-6 border-b border-border-light dark:border-border-dark flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold shrink-0">
          <Hexagon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
          <h2 className="text-sm font-semibold truncate text-text-main-light dark:text-text-main-dark">Manageko.</h2>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">manag@mail.com</p>
        </div>
      </SidebarHeader>

      {/* Main Menu */}
      <div className="p-4 space-y-1">
        <p className="px-2 text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-2 uppercase tracking-wider group-data-[collapsible=icon]:hidden">Main Menu</p>
        {navMain.map((item) => (
          <Link 
            key={item.title} 
            href={item.url}
            className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-text-muted-light hover:text-text-main-light hover:bg-gray-100 dark:text-text-muted-dark dark:hover:text-text-main-dark dark:hover:bg-gray-800 transition-colors"
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
            {item.badge && (
              <span className="ml-auto bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-400 group-data-[collapsible=icon]:hidden">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* My Pages */}
      <div className="p-4 flex-1">
        <p className="px-2 text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-2 uppercase tracking-wider flex justify-between items-center group-data-[collapsible=icon]:hidden">
          My Pages
          <ChevronDown className="w-4 h-4" />
        </p>
        <div className="space-y-1">
          {myPages.map((page) => {
            const isActive = pathname.startsWith(page.url) && page.url !== '#'
            return (
              <Link
                key={page.title}
                href={page.url}
                className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-100 text-text-main-light dark:bg-gray-800 dark:text-text-main-dark' 
                    : 'text-text-muted-light hover:text-text-main-light hover:bg-gray-100 dark:text-text-muted-dark dark:hover:text-text-main-dark dark:hover:bg-gray-800'
                }`}
              >
                <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center text-white text-[10px] font-bold ${page.colorClass}`}>
                  {page.initial ? page.initial : (page.icon && <page.icon className="w-3.5 h-3.5" />)}
                </div>
                <span className="group-data-[collapsible=icon]:hidden">{page.title}</span>
                {page.badge && (
                  <span className="ml-auto text-text-muted-light dark:text-text-muted-dark text-xs group-data-[collapsible=icon]:hidden">
                    {page.badge}
                  </span>
                )}
              </Link>
            )
          })}
          
          <Link
            href="#"
            className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-text-muted-light hover:text-text-main-light hover:bg-gray-100 dark:text-text-muted-dark dark:hover:text-text-main-dark dark:hover:bg-gray-800 transition-colors mt-2"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Create New</span>
          </Link>
        </div>
      </div>
    </Sidebar>
  )
}
