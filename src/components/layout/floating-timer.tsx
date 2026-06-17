"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTimerStore } from "@/store/useTimerStore"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square, TimerReset } from "lucide-react"
import Link from "next/link"

export function FloatingTimer() {
  const pathname = usePathname()
  const { timeLeft, isRunning, type, workDuration, breakDuration, startTimer, pauseTimer, tick, resetTimer } = useTimerStore()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by rendering only on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    } else if (timeLeft <= 0 && isRunning) {
      // Auto pause when it reaches 0
      pauseTimer()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, tick, pauseTimer])

  // Don't show the floating widget if we are ON the timer page itself
  if (!mounted || pathname === "/timer") return null

  // Don't show if the timer hasn't started and we are not in the middle of a session
  // Usually, we want the widget if it's running, or paused but partway through.
  const isStarted = isRunning || timeLeft !== (type === 'WORK' ? workDuration * 60 : breakDuration * 60)
  if (!isStarted) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  const totalSeconds = type === 'WORK' ? workDuration * 60 : breakDuration * 60
  const progress = totalSeconds > 0 ? 100 - (timeLeft / totalSeconds) * 100 : 0

  return (
    <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-full px-5 py-3 shadow-overlay border border-border flex items-center gap-4 transition-all hover:scale-[1.02]">
        
        {/* Progress Ring */}
        <Link href="/timer" className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer group">
          <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-muted opacity-30" />
            <circle 
              cx="24" cy="24" r="22" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="transparent" 
              className={type === 'WORK' ? "text-red-500" : "text-green-500"} 
              strokeDasharray="138" 
              strokeDashoffset={138 - (138 * progress) / 100} 
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="font-sans font-bold tracking-tight text-xs tabular-nums">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[var(--on-surface)] hover:bg-surface-container-high transition-colors" onClick={pauseTimer}>
              <Pause className="h-4 w-4 fill-current" />
            </button>
          ) : (
            <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[var(--on-surface)] hover:bg-surface-container-high transition-colors" onClick={startTimer}>
              <Play className="h-4 w-4 fill-current" />
            </button>
          )}
          <button className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-[var(--on-surface-variant)] hover:bg-surface-container hover:text-[var(--on-surface)] transition-colors" onClick={resetTimer}>
            <TimerReset className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
