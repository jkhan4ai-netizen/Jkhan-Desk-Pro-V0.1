"use client"

import { Filter, MoreHorizontal, Target, AlignLeft, Calendar, LayoutGrid, Flag, ChevronDown } from "lucide-react"

// Dummy data matching the HTML template
const todoTasks = [
  { id: 1, name: "Employee Details", desc: "Create a page where there is information about employees", date: "Feb 14, 2024 - Feb 1, 2024", priority: "Medium" },
  { id: 2, name: "Darkmode version", desc: "Darkmode version for all screens", date: "Feb 14, 2024 - Feb 1, 2024", priority: "Low" },
]

const progressTasks = [
  { id: 3, name: "Super Admin Role", desc: "-", date: "Feb 14, 2024 - Feb 1, 2024", priority: "High" },
]

export function DashboardTasksList() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
      <div className="p-5 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
        <div>
          <h2 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Текущие Задачи</h2>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">Ваши задачи в статусе "Нужно сделать" или "В работе".</p>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 text-text-muted-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors dark:text-text-muted-dark">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-text-muted-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors dark:text-text-muted-dark">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-text-muted-light dark:text-text-muted-dark border-b border-border-light dark:border-border-dark bg-gray-50/30 dark:bg-gray-800/20">
        <div className="col-span-4 flex items-center gap-3">
          <Target className="w-4 h-4" /> Task Name
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <AlignLeft className="w-4 h-4" /> Description
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Estimation
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" /> Type
        </div>
        <div className="col-span-1 flex items-center gap-2 justify-end">
          <Flag className="w-4 h-4" />
        </div>
      </div>

      <div className="divide-y divide-border-light dark:divide-border-dark flex-1 overflow-y-auto">
        {/* To-do Group */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-2 flex items-center gap-2">
          <ChevronDown className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
          <span className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">To-do</span>
          <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
            {todoTasks.length}
          </span>
        </div>

        {todoTasks.map(task => (
          <div key={task.id} className="grid grid-cols-12 gap-4 px-5 py-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
            <div className="col-span-4 flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
              <span className="text-sm font-medium text-text-main-light dark:text-text-main-dark truncate">{task.name}</span>
            </div>
            <div className="col-span-3">
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark line-clamp-2">{task.desc}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-text-main-light dark:text-text-main-dark">{task.date}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
            </div>
            <div className="col-span-1 flex items-center justify-end gap-3">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-blue-200 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[8px] font-bold text-blue-700 z-10">AL</div>
                <div className="w-6 h-6 rounded-full bg-green-200 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[8px] font-bold text-green-700 z-0">DT</div>
              </div>
              {task.priority === 'Medium' ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Medium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Low
                </span>
              )}
            </div>
          </div>
        ))}

        {/* On Progress Group */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-2 flex items-center gap-2 border-t border-border-light dark:border-border-dark">
          <ChevronDown className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
          <span className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">On Progress</span>
          <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
            {progressTasks.length}
          </span>
        </div>

        {progressTasks.map(task => (
          <div key={task.id} className="grid grid-cols-12 gap-4 px-5 py-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
            <div className="col-span-4 flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700" />
              <span className="text-sm font-medium text-text-main-light dark:text-text-main-dark truncate">{task.name}</span>
            </div>
            <div className="col-span-3">
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark line-clamp-2">{task.desc}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-text-main-light dark:text-text-main-dark">{task.date}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
            </div>
            <div className="col-span-1 flex items-center justify-end gap-3">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-green-200 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[8px] font-bold text-green-700 z-0">DT</div>
              </div>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> High
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
