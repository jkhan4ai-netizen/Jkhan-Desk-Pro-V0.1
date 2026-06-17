"use client"

import { useState } from "react"
import { ChevronRight, MoreHorizontal, Search, Filter, Plus } from "lucide-react"

export function AccordionList({ initialTodos = [] }: { initialTodos?: any[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'To-do': true,
    'On Progress': true,
    'In Review': true,
  })

  const toggleGroup = (group: string) => {
    setExpanded(prev => ({ ...prev, [group]: !prev[group] }))
  }

  // Placeholder data for the design since real data might not match all fields perfectly
  const groups = [
    {
      id: 'To-do',
      title: 'To-do',
      count: 3,
      items: [
        { id: 1, name: "Employee Details", desc: "Create a page where there is information about employees", date: "Feb 14, 2024 - Feb 1, 2024", type: "Dashboard", typeColor: "purple", priority: "Medium", priorityColor: "orange" },
        { id: 2, name: "Darkmode version", desc: "Darkmode version for all screens", date: "Feb 14, 2024 - Feb 1, 2024", type: "Mobile App", typeColor: "orange", priority: "Low", priorityColor: "blue" },
        { id: 3, name: "Super Admin Role", desc: "-", date: "Feb 14, 2024 - Feb 1, 2024", type: "Dashboard", typeColor: "purple", priority: "Medium", priorityColor: "orange" }
      ]
    },
    {
      id: 'On Progress',
      title: 'On Progress',
      count: 3,
      items: [
        { id: 4, name: "Super Admin Role", desc: "-", date: "Feb 14, 2024 - Feb 1, 2024", type: "Dashboard", typeColor: "purple", priority: "High", priorityColor: "red" },
        { id: 5, name: "Settings Page", desc: "-", date: "Feb 14, 2024 - Feb 1, 2024", type: "Mobile App", typeColor: "orange", priority: "Medium", priorityColor: "orange" },
        { id: 6, name: "KPI and Employee Statistics", desc: "Create a design that displays KPIs and employee statistics", date: "Feb 14, 2024 - Feb 1, 2024", type: "Dashboard", typeColor: "purple", priority: "Low", priorityColor: "blue" }
      ]
    },
    {
      id: 'In Review',
      title: 'In Review',
      count: 2,
      items: [
        { id: 7, name: "Customer Role", desc: "-", date: "Feb 14, 2024 - Feb 1, 2024", type: "Dashboard", typeColor: "purple", priority: "Medium", priorityColor: "orange" },
        { id: 8, name: "Admin Role", desc: "Set up with relevant information such as profile picture, phone number etc", date: "Feb 14, 2024 - Feb 1, 2024", type: "Mobile App", typeColor: "orange", priority: "High", priorityColor: "red" }
      ]
    }
  ]

  const badgeStyles: Record<string, string> = {
    purple: "bg-[#F3E8FF] text-[#7E22CE]",
    orange: "bg-[#FFF7ED] text-[#EA580C]",
    blue: "bg-[#EFF6FF] text-[#2563EB]",
    red: "bg-[#FEF2F2] text-[#DC2626]",
  }

  return (
    <div className="w-full">
      {/* Filters Area */}
      <div className="flex items-center justify-between mb-4 mt-6">
        <div></div> {/* Empty left side as requested */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 bg-white text-gray-500">
            <Search className="w-4 h-4" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-32 placeholder:text-gray-400" />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 bg-white text-gray-600 text-sm hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Accordion List Area */}
      <div className="flex flex-col gap-6">
        {groups.map(group => (
          <div key={group.id} className="flex flex-col">
            
            {/* Group Header */}
            <div 
              className="flex items-center gap-2 py-2 mb-2 bg-gray-50/50 rounded-md px-2 border-y border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleGroup(group.id)}
            >
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded[group.id] ? 'rotate-90' : ''}`} />
              <span className="font-semibold text-sm text-gray-900">{group.title}</span>
              <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{group.count}</span>
              <button className="ml-auto text-gray-400 hover:text-gray-600"><Plus className="w-4 h-4" /></button>
            </div>

            {/* List Header (Only if expanded) */}
            {expanded[group.id] && (
              <div className="grid grid-cols-[3fr_3fr_2fr_1fr_1fr_1fr_40px] gap-4 py-2 border-b border-gray-100 items-center px-2 mb-2">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                  <div className="w-4 h-4 rounded border border-gray-300" />
                  Task Name
                </div>
                <div className="text-sm font-medium text-gray-500">Description</div>
                <div className="text-sm font-medium text-gray-500">Estimation</div>
                <div className="text-sm font-medium text-gray-500">Type</div>
                <div className="text-sm font-medium text-gray-500">People</div>
                <div className="text-sm font-medium text-gray-500">Priority</div>
                <div className="flex justify-center text-sm font-medium text-gray-500"><Plus className="w-4 h-4" /></div>
              </div>
            )}

            {/* List Items */}
            {expanded[group.id] && group.items.map(item => (
              <div key={item.id} className="grid grid-cols-[3fr_3fr_2fr_1fr_1fr_1fr_40px] gap-4 py-3 items-center border-b border-gray-50 hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer rounded-lg -mx-2 px-4">
                <div className="flex items-center gap-3 text-sm text-gray-900 font-medium">
                  <div className="w-4 h-4 rounded border border-gray-300 bg-white shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="text-sm text-gray-500 truncate">{item.desc}</div>
                <div className="text-sm text-gray-500">{item.date}</div>
                <div>
                  <span className={`rounded px-2.5 py-1 text-xs font-medium w-max ${badgeStyles[item.typeColor]}`}>
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 shrink-0 z-20 flex items-center justify-center text-[8px] font-bold text-blue-600">AL</div>
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-green-100 shrink-0 -ml-2 z-10 flex items-center justify-center text-[8px] font-bold text-green-600">DT</div>
                  {item.priority === 'High' && <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 shrink-0 -ml-2 z-0"></div>}
                </div>
                <div>
                  <span className={`rounded px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 w-max ${badgeStyles[item.priorityColor]}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.priorityColor === 'orange' ? 'bg-[#EA580C]' : item.priorityColor === 'blue' ? 'bg-[#2563EB]' : 'bg-[#DC2626]'}`} />
                    {item.priority}
                  </span>
                </div>
                <div className="flex justify-center text-gray-400 hover:text-gray-900">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
