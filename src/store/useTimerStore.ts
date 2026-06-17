import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SessionType = 'WORK' | 'BREAK'

interface TimerState {
  timeLeft: number // in seconds
  isRunning: boolean
  type: SessionType
  workDuration: number // in minutes
  breakDuration: number // in minutes
  
  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tick: () => void
  setType: (type: SessionType) => void
  setDurations: (work: number, breakTime: number) => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      timeLeft: 25 * 60,
      isRunning: false,
      type: 'WORK',
      workDuration: 25,
      breakDuration: 5,

      startTimer: () => set({ isRunning: true }),
      pauseTimer: () => set({ isRunning: false }),
      resetTimer: () =>
        set((state) => ({
          isRunning: false,
          timeLeft: (state.type === 'WORK' ? state.workDuration : state.breakDuration) * 60,
        })),
      tick: () =>
        set((state) => {
          if (state.timeLeft <= 0) {
            return { isRunning: false, timeLeft: 0 }
          }
          return { timeLeft: state.timeLeft - 1 }
        }),
      setType: (type) =>
        set((state) => ({
          type,
          timeLeft: (type === 'WORK' ? state.workDuration : state.breakDuration) * 60,
          isRunning: false,
        })),
      setDurations: (work, breakTime) =>
        set((state) => ({
          workDuration: work,
          breakDuration: breakTime,
          // Only update timeLeft if we aren't currently running, or if we reset
          timeLeft: state.type === 'WORK' ? work * 60 : breakTime * 60,
        })),
    }),
    {
      name: 'pomodoro-timer-storage',
    }
  )
)
