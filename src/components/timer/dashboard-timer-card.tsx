"use client"

import { useTimerStore } from "@/store/useTimerStore"
import { Button } from "@/components/ui/button"
import { Clock, Play, Pause, TimerReset } from "lucide-react"
import Link from "next/link"

export function DashboardTimerCard() {
  const { timeLeft, isRunning, type, startTimer, pauseTimer, resetTimer } = useTimerStore()
  
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  const progress = type === 'WORK' 
    ? 100 - (timeLeft / (useTimerStore.getState().workDuration * 60)) * 100 
    : 100 - (timeLeft / (useTimerStore.getState().breakDuration * 60)) * 100

  // We check if it's the default state (not started)
  const isDefaultState = !isRunning && timeLeft === useTimerStore.getState().workDuration * 60

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-muted mb-6 group">
        <span className="font-sans font-bold tracking-tight text-4xl text-foreground tabular-nums drop-shadow-md">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <svg viewBox="0 0 128 128" className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-accent opacity-20" />
          <circle 
            cx="64" cy="64" r="60" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="transparent" 
            className={type === 'WORK' ? "text-red-500" : "text-green-500"} 
            strokeDasharray="377" 
            strokeDashoffset={377 - (377 * progress) / 100} 
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
      </div>
      
      <div className="flex gap-2 w-full">
        <Button 
          className={`flex-1 ${isRunning ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-success'}`}
          onClick={isRunning ? pauseTimer : startTimer}
        >
          {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isRunning ? 'Пауза' : 'Старт'}
        </Button>
    </div>
  )
}
