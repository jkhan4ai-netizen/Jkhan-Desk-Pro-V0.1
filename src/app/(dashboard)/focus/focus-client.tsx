"use client"

import { useState, useTransition } from "react"
import { useTimerStore } from "@/store/useTimerStore"
import { updateTodoStatus } from "@/lib/actions/todos"
import { Play, Pause, Square, TimerReset, Search, MoreVertical, Plus, Check, Coffee } from "lucide-react"

export function FocusClient({ initialTodos }: { initialTodos: any[] }) {
  const [todos, setTodos] = useState(initialTodos)
  const [isPending, startTransition] = useTransition()
  
  const { 
    timeLeft, 
    isRunning, 
    type, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    setType
  } = useTimerStore()

  // Format time
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const progress = type === 'WORK' 
    ? 100 - (timeLeft / (25 * 60)) * 100 
    : 100 - (timeLeft / (5 * 60)) * 100

  // Handle task toggle
  const handleToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE"
    // Optimistic update
    setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t))
    
    startTransition(async () => {
      await updateTodoStatus(id, newStatus)
    })
  }

  // Daily Progress Stats
  const totalTasks = todos.length
  const doneTasks = todos.filter(t => t.status === "DONE").length
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const todayTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const currentTask = todos.find(t => t.status !== "DONE") || todos[0]

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-[900px] mx-auto animate-fade-in">
      
      {/* LEFT COLUMN: Tasks List */}
      <div className="w-full md:w-[420px] h-[600px] flex flex-col relative bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-lg font-semibold text-[#1A2433]">Tasks List <span className="text-sm font-medium text-slate-400 font-normal">({totalTasks} Tasks)</span></h2>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="hover:text-[#1A2433] transition-colors"><Search className="w-5 h-5" /></button>
            <button className="hover:text-[#1A2433] transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-1">
          {todos.map(todo => {
            const isDone = todo.status === "DONE"
            return (
              <div 
                key={todo.id} 
                onClick={() => handleToggle(todo.id, todo.status)}
                className="flex items-center gap-4 py-3 w-full hover:bg-white/40 transition-colors duration-200 rounded-2xl cursor-pointer -mx-2 px-2"
              >
                {/* Radio Checkbox */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-[#4ADE80] border-[#4ADE80]' : 'border-[#4ADE80]'}`}>
                  {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>

                {/* Icon block */}
                <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {todo.title.includes('meeting') ? '💼' : todo.title.includes('design') ? '🎨' : todo.title.includes('exercise') ? '🏋️' : '📋'}
                </div>

                {/* Text Block */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <span className={`text-sm font-medium truncate ${isDone ? 'line-through text-slate-400' : 'text-[#1A2433]'}`}>
                    {todo.title}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {isDone ? 'Done' : 'Session 1/1'}
                  </span>
                </div>

                {/* Time */}
                <div className="text-xs text-slate-400 text-right shrink-0">
                  00:00
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Task Button */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white/90 via-white/80 to-transparent flex justify-center">
          <button className="flex items-center gap-2 text-[#4ADE80] font-semibold hover:opacity-80 transition-opacity">
            <div className="w-5 h-5 rounded-full bg-[#4ADE80] text-white flex items-center justify-center">
              <Plus className="w-3 h-3" />
            </div>
            Add Task
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Progress & Timer */}
      <div className="w-full md:w-[420px] flex flex-col gap-6">
        
        {/* Top Card: Daily Progress */}
        <div className="h-auto bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] p-6 relative overflow-hidden flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-[#1A2433]">Daily Progress</h3>
            <div className="flex items-center gap-3">
              <div className="bg-[#3B82F6] text-white text-xs font-semibold px-3 py-1 rounded-full">
                {doneTasks}/{totalTasks}
              </div>
              <span className="text-sm font-medium text-slate-500">Tasks was done</span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">{todayDate} - {todayTime}</p>
          </div>
          
          {/* Progress Circle */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/50" />
              <circle 
                cx="40" cy="40" r="36" 
                stroke="url(#grad)" 
                strokeWidth="6" 
                fill="transparent" 
                strokeLinecap="round"
                strokeDasharray="226" 
                strokeDashoffset={226 - (226 * progressPercent) / 100} 
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <span className="text-lg font-semibold text-[#1A2433] absolute">{progressPercent}%</span>
          </div>
        </div>

        {/* Bottom Card: Timer */}
        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] p-6 flex flex-col items-center justify-between">
          
          {/* Tabs */}
          <div className="bg-white/30 p-1.5 rounded-full flex w-full max-w-[300px] mx-auto mt-2 relative">
            <button 
              onClick={() => { pauseTimer(); setType('WORK') }}
              className={`w-1/2 text-center text-sm font-semibold rounded-full px-6 py-2 transition-all duration-300 flex items-center justify-center gap-2 ${type === 'WORK' ? 'bg-white text-[#1A2433] shadow-sm' : 'text-slate-500 hover:text-[#1A2433]'}`}
            >
              <div className={`w-2 h-2 rounded-full ${type === 'WORK' ? 'bg-[#3B82F6]' : 'bg-transparent'}`} />
              Ongoing
            </button>
            <button 
              onClick={() => { pauseTimer(); setType('BREAK') }}
              className={`w-1/2 text-center text-sm font-semibold rounded-full px-6 py-2 transition-all duration-300 flex items-center justify-center gap-2 ${type !== 'WORK' ? 'bg-white text-[#1A2433] shadow-sm' : 'text-slate-500 hover:text-[#1A2433]'}`}
            >
              <Coffee className="w-4 h-4" />
              Break
            </button>
          </div>

          {/* Time Display */}
          <div className="mt-8 text-[80px] font-semibold leading-none tracking-tight text-[#1A2433]">
            {timeString}
          </div>

          {/* Linear Progress Bar */}
          <div className="w-48 h-1.5 bg-white/50 rounded-full mx-auto my-6 overflow-hidden">
            <div 
              className="bg-[#4ADE80] h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current Task Pill */}
          <div className="bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-[#1A2433] w-full max-w-[320px] mx-auto truncate">
            {currentTask ? (
              <>
                <span className="text-[#4ADE80] shrink-0">📗</span>
                <span className="truncate">{currentTask.title}</span>
              </>
            ) : (
              <span className="text-slate-500">All tasks completed</span>
            )}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-4 mt-8 mb-4">
            <button 
              onClick={resetTimer}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
            >
              <TimerReset className="w-5 h-5" />
            </button>
            
            <button 
              onClick={isRunning ? pauseTimer : startTimer}
              className="bg-[#4ADE80] text-white px-8 py-3 rounded-full flex items-center gap-2 font-semibold shadow-sm hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
            >
              <div className="w-3 h-3 bg-white rounded-sm shrink-0" />
              {isRunning ? 'Stop' : 'Start'}
            </button>
            
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer">
              <Play className="w-5 h-5 ml-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
