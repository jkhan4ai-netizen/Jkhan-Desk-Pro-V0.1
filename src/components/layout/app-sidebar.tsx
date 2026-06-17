"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wallet,
  CheckSquare,
  Clock,
  Settings,
  ShieldCheck,
  LifeBuoy,
  Server,
  ShoppingCart
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { signout } from "@/lib/actions/auth"
import { usePathname } from "next/navigation"

// Sample data
const data = {
  navMain: [
    {
      title: "Главная",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Проекты",
      url: "/projects",
      icon: Briefcase,
    },
    {
      title: "CRM (Клиенты)",
      url: "/crm",
      icon: Users,
    },
    {
      title: "Финансы",
      url: "/finance",
      icon: Wallet,
    },
    {
      title: "Фокус",
      url: "/focus",
      icon: Clock,
    },
    {
      title: "Покупки",
      url: "/wishlist",
      icon: ShoppingCart,
    },
  ],
  navSecondary: [
    {
      title: "Система",
      url: "/system",
      icon: Server,
    },
    {
      title: "Настройки",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Помощь",
      url: "/help",
      icon: LifeBuoy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props} className="w-[260px] flex-shrink-0 flex flex-col bg-white border-r border-gray-100 py-6 px-4">
      {/* macOS Dots */}
      <div className="flex gap-2 mb-6 px-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>

      <SidebarHeader className="flex flex-row items-center pb-4 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white shadow-sm animate-fade-in">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 flex flex-col overflow-hidden transition-all group-data-[collapsible=icon]:hidden">
          <span className="font-sans font-bold text-sm text-gray-900 truncate">
            Manageko.
          </span>
          <span className="text-xs text-gray-500 truncate">
            manag@mail.com
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 mt-2 flex flex-col gap-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = item.url === '/' ? pathname === '/' : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <a href={item.url} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            MY PAGES
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <a href={item.url} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        {/* Promo Widget */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 group-data-[collapsible=icon]:hidden">
          <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Add an extra security to your account.</h4>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">Add a secondary method of verification used during login.</p>
          <button className="w-full bg-gray-900 text-white rounded-lg py-2 text-xs font-semibold hover:bg-gray-800 transition-colors mb-2">
            Enable 2-step verification
          </button>
          <button className="w-full text-gray-600 text-xs font-medium hover:text-gray-900 transition-colors">
            Learn more
          </button>
        </div>

        <form action={signout}>
          <button type="submit" className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-smooth cursor-pointer text-gray-600 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-gray-600">JK</span>
            </div>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden text-left">
              <span className="text-sm font-medium truncate">Sign out</span>
            </div>
          </button>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
