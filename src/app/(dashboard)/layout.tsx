import * as React from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { FloatingTimer } from "@/components/layout/floating-timer"
import { DashboardBreadcrumb } from "@/components/layout/dashboard-breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent flex flex-col flex-1 overflow-hidden">
        <header className="flex justify-between items-center w-full h-10 px-8 mt-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardBreadcrumb />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 flex flex-col px-8 py-6 overflow-y-auto gap-6 animate-fade-in">
          {children}
        </main>
      </SidebarInset>
      <FloatingTimer />
    </SidebarProvider>
  )
}
