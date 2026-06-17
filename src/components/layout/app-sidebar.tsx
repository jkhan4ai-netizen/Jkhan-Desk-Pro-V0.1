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
    <Sidebar collapsible="icon" {...props} className="w-64 flex flex-col bg-transparent border-r border-gray-200/50 py-6 px-4">
      <SidebarHeader className="flex flex-row items-center pb-4 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white shadow-sm animate-fade-in">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 flex flex-col overflow-hidden transition-all group-data-[collapsible=icon]:hidden">
          <span className="font-sans font-bold tracking-tight text-lg leading-tight text-foreground truncate">
            Jkhan Desk Pro
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground truncate">
            Workspace
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 mt-4 flex flex-col gap-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Меню
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = item.url === '/' ? pathname === '/' : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <a href={item.url} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-200/50'}`}>
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
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Система
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <a href={item.url} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-200/50'}`}>
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

      <SidebarFooter className="p-4">
        <form action={signout}>
          <button type="submit" className="w-full flex items-center gap-3 p-2 rounded-[1.5rem] bg-muted/40 hover:bg-muted/80 transition-smooth cursor-pointer border border-transparent hover:border-destructive/50 hover:text-destructive group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">JK</span>
            </div>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden text-left">
              <span className="text-sm font-medium truncate">Выйти</span>
              <span className="text-xs opacity-70 truncate">Завершить сеанс</span>
            </div>
          </button>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
