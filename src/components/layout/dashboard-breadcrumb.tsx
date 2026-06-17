"use client"

import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const routeNames: Record<string, string> = {
  "/": "Дашборд",
  "/projects": "Проекты",
  "/crm": "CRM (Клиенты)",
  "/finance": "Финансы",
  "/todos": "Задачи",
  "/timer": "Таймер",
  "/wishlist": "Покупки",
  "/system": "Система",
  "/settings": "Настройки",
  "/help": "Помощь",
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  
  // Find the matching route name or default to Dashboard
  const currentPage = routeNames[pathname] || "Страница"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Главная</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
