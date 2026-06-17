"use client"

import { Play, Square } from "lucide-react"
import { useTimerStore } from "@/store/useTimerStore"
import { useEffect, useState } from "react"

export function DashboardTimerWidget() {
  const { timeLeft, isRunning, startTimer, pauseTimer, tick } = useTimerStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    } else if (timeLeft <= 0) {
      pauseTimer()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, tick, pauseTimer])

  // Don't render until mounted to avoid hydration mismatch with local storage
  if (!mounted) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  // Assuming total time is 25 minutes for the circle progress calculation
  const totalSeconds = 25 * 60
  const percentage = (timeLeft / totalSeconds) * 100
  const dashoffset = 283 - (283 * percentage) / 100

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-8 rounded-xl shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
      <h2 className="text-xl font-bold text-text-main-light dark:text-text-main-dark mb-2">Время фокусировки</h2>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-8">Управляйте таймером отсюда.</p>

      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="text-gray-100 dark:text-gray-800" 
            cx="50" 
            cy="50" 
            fill="none" 
            r="45" 
            stroke="currentColor" 
            strokeWidth="6"
          />
          <circle 
            className="text-primary transition-all duration-1000 ease-linear" 
            cx="50" 
            cy="50" 
            fill="none" 
            r="45" 
            stroke="currentColor" 
            strokeDasharray="283" 
            strokeDashoffset={dashoffset} 
            strokeWidth="6"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-text-main-light dark:text-text-main-dark tracking-tight">
            {timeString}
          </span>
        </div>
      </div>

      {!isRunning ? (
        <button 
          onClick={startTimer}
          className="w-full bg-primary hover:bg-blue-600 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-colors shadow-sm text-sm"
        >
          <Play className="w-5 h-5 fill-current" />
          Старт
        </button>
      ) : (
        <button 
          onClick={pauseTimer}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-colors shadow-sm text-sm"
        >
          <Square className="w-5 h-5 fill-current" />
          Пауза
        </button>
      )}
    </div>
  )
}
