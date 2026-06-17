import { PomodoroTimer } from "@/components/timer/pomodoro-timer"
import { getTodaySessions } from "@/lib/actions/timer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, Briefcase, Flame, CheckCircle2, Play, Pause } from "lucide-react"
export default async function TimerPage() {
  const { sessions, error } = await getTodaySessions();

  const totalWorkMinutes = sessions?.filter((s: any) => s.type === 'WORK' && s.completed).reduce((acc: number, s: any) => acc + s.duration_minutes, 0) || 0;
  const completedPomodoros = sessions?.filter((s: any) => s.type === 'WORK' && s.completed).length || 0;

  return (
    <div className="flex flex-col gap-6 lg:flex-row h-full">
      {/* Left Column: Timer */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="mb-6">
          <h1 className="font-calistoga text-3xl font-bold tracking-tight">Тайм-Менеджмент</h1>
          <p className="text-muted-foreground mt-1">Используйте метод Pomodoro для глубокого фокуса.</p>
        </div>

        <PomodoroTimer />
      </div>

      {/* Right Column: Today's Stats */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:pt-[76px]">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Flame className="h-6 w-6 text-red-500 mb-2" />
              <div className="text-2xl font-calistoga">{completedPomodoros}</div>
              <div className="text-xs text-muted-foreground">Помидорок сегодня</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-6 w-6 text-accent mb-2" />
              <div className="text-2xl font-calistoga">
                {Math.floor(totalWorkMinutes / 60)}ч {totalWorkMinutes % 60}м
              </div>
              <div className="text-xs text-muted-foreground">В глубоком фокусе</div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card className="glass-panel border-border/50 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">История за сегодня</CardTitle>
            <CardDescription>Завершенные сессии</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : sessions?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Вы еще не запускали таймер сегодня.</p>
            ) : (
              sessions?.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${session.type === 'WORK' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {session.type === 'WORK' ? <Flame className="h-4 w-4" /> : <Coffee className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {session.type === 'WORK' ? 'Фокус' : 'Отдых'} ({session.duration_minutes}м)
                      </p>
                      {session.projects && (
                         <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                           <Briefcase className="h-3 w-3" /> {session.projects.title}
                         </p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.ended_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
