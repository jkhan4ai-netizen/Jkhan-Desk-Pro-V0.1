"use client"

import * as React from "react"
import { Play, Pause, RotateCcw, Coffee, Briefcase } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProjects } from "@/lib/actions/projects"
import { savePomodoroSession } from "@/lib/actions/timer"

const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

import { useTimerStore } from "@/store/useTimerStore"

export function PomodoroTimer() {
  const { 
    timeLeft, 
    isRunning, 
    type: mode, 
    startTimer, 
    pauseTimer, 
    resetTimer: storeReset, 
    setType 
  } = useTimerStore()

  const [projectId, setProjectId] = React.useState<string>("none");
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    getProjects().then(res => {
      if (res.projects) setProjects(res.projects);
    });
  }, []);

  // Timer interval is now handled globally if we want, but for robust sync 
  // we let the floating widget or a global provider handle the interval.
  // Wait, if we are on this page, the FloatingTimer is NOT mounted! 
  // So we MUST run the interval here as well.
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        useTimerStore.getState().tick();
      }, 1000);
    } else if (isRunning && timeLeft <= 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Document Title update
  React.useEffect(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    document.title = `${m}:${s} - ${mode === 'WORK' ? 'Фокус' : 'Отдых'}`;
    
    return () => {
      document.title = "Jkhan Desk Pro";
    };
  }, [timeLeft, mode]);

  const handleComplete = async () => {
    pauseTimer();
    toast.success(mode === 'WORK' ? "Отличная работа! Пора отдохнуть." : "Перерыв окончен, за работу!");
    
    // Save session
    const durationMins = mode === 'WORK' ? useTimerStore.getState().workDuration : useTimerStore.getState().breakDuration;
    await savePomodoroSession({
      projectId: projectId === "none" ? null : projectId,
      durationMinutes: durationMins,
      type: mode === 'WORK' ? 'WORK' : (durationMins === 15 ? 'LONG_BREAK' : 'SHORT_BREAK'),
      completed: true,
    });

    // Auto-switch mode
    if (mode === 'WORK') {
      switchMode('BREAK');
    } else {
      switchMode('WORK');
    }
  };

  const switchMode = (newMode: 'WORK' | 'BREAK' | 'SHORT_BREAK' | 'LONG_BREAK') => {
    pauseTimer();
    if (newMode === 'WORK') {
      useTimerStore.getState().setDurations(25, useTimerStore.getState().breakDuration);
      setType('WORK');
    } else if (newMode === 'SHORT_BREAK') {
      useTimerStore.getState().setDurations(useTimerStore.getState().workDuration, 5);
      setType('BREAK');
    } else if (newMode === 'LONG_BREAK' || newMode === 'BREAK') {
      useTimerStore.getState().setDurations(useTimerStore.getState().workDuration, 15);
      setType('BREAK');
    }
  };

  const resetTimer = () => {
    storeReset();
  };

  const toggleTimer = () => {
    if (isRunning) pauseTimer();
    else startTimer();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Dynamic classes based on mode
  const bgClass = mode === 'WORK' 
    ? 'bg-gradient-to-br from-red-500/10 to-orange-500/5 border-red-500/20' 
    : 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20';

  const textClass = mode === 'WORK' ? 'text-red-400' : 'text-green-400';

  return (
    <Card className={`glass-panel overflow-hidden transition-colors duration-500 border ${bgClass}`}>
      <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        
        {/* Mode Selector */}
        <div className="flex bg-background/50 p-1 rounded-full border border-border/50 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full px-6 transition-smooth ${mode === 'WORK' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-muted-foreground'}`}
            onClick={() => switchMode('WORK')}
          >
            Фокус (25)
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full px-6 transition-smooth ${mode === 'BREAK' && useTimerStore.getState().breakDuration === 5 ? 'bg-green-500/20 text-green-400 font-bold' : 'text-muted-foreground'}`}
            onClick={() => switchMode('SHORT_BREAK')}
          >
            Отдых (5)
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full px-6 transition-smooth hidden sm:flex ${mode === 'BREAK' && useTimerStore.getState().breakDuration === 15 ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-muted-foreground'}`}
            onClick={() => switchMode('LONG_BREAK')}
          >
            Большой Отдых (15)
          </Button>
        </div>

        {/* Project Selector */}
        {mode === 'WORK' && (
          <div className="w-full max-w-xs mb-8 animate-fade-in">
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="bg-background/50 border-border/50 shadow-sm">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Без проекта" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Без проекта</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Timer Display */}
        <div className={`font-sans font-bold tracking-tight text-8xl md:text-[140px] leading-none mb-12 tracking-tight ${textClass} tabular-nums drop-shadow-lg`}>
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button 
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 p-0 border-border/50 bg-background/50"
            onClick={resetTimer}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button 
            size="lg" 
            className={`rounded-full w-20 h-20 p-0 shadow-lg ${mode === 'WORK' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-all hover:scale-105`}
            onClick={toggleTimer}
          >
            {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 p-0 border-border/50 bg-background/50 opacity-0 pointer-events-none"
          >
            {/* Placeholder for layout balance */}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
