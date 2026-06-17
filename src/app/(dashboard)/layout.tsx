import * as React from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { FloatingTimer } from "@/components/layout/floating-timer"
import { DashboardBreadcrumb } from "@/components/layout/dashboard-breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Star, Share, MoreHorizontal } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-surface-light dark:bg-surface-dark flex flex-col flex-1 overflow-hidden min-w-0 h-full">
        <header className="h-14 border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 shrink-0 sticky top-0 bg-surface-light dark:bg-surface-dark z-10">
          <div className="flex items-center text-sm text-text-muted-light dark:text-text-muted-dark gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <DashboardBreadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="flex items-center gap-1.5 text-sm font-medium text-text-muted-light hover:text-text-main-light dark:text-text-muted-dark dark:hover:text-text-main-dark transition-colors">
              <Plus className="w-4 h-4" /> New Tab
            </button>
            <button className="text-text-muted-light hover:text-text-main-light dark:text-text-muted-dark dark:hover:text-text-main-dark transition-colors">
              <Star className="w-5 h-5" />
            </button>
            <button className="text-text-muted-light hover:text-text-main-light dark:text-text-muted-dark dark:hover:text-text-main-dark transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button className="text-text-muted-light hover:text-text-main-light dark:text-text-muted-dark dark:hover:text-text-main-dark transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col animate-fade-in bg-surface-light dark:bg-surface-dark">
          {children}
        </main>
      </SidebarInset>
      <FloatingTimer />
    </SidebarProvider>
  )
}
