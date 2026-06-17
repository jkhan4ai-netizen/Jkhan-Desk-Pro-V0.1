"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTimerStore } from "@/store/useTimerStore"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square, TimerReset } from "lucide-react"
import Link from "next/link"

export function FloatingTimer() {
  const pathname = usePathname()
  const { timeLeft, isRunning, type, startTimer, pauseTimer, tick, resetTimer } = useTimerStore()
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
  const isStarted = isRunning || timeLeft !== (type === 'WORK' ? 25 * 60 : 5 * 60)
  if (!isStarted) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  const progress = type === 'WORK' 
    ? 100 - (timeLeft / (25 * 60)) * 100 
    : 100 - (timeLeft / (5 * 60)) * 100

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="glass-panel border-border/50 shadow-glow-accent rounded-2xl p-4 flex items-center gap-4 transition-all hover:scale-[1.02]">
        
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
          <span className="font-sans font-bold tracking-tight text-xs font-bold tabular-nums">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {isRunning ? (
            <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground" onClick={pauseTimer}>
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="h-8 w-8 text-foreground" onClick={startTimer}>
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={resetTimer}>
            <TimerReset className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
