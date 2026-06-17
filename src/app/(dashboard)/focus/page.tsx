import { PomodoroTimer } from "@/components/timer/pomodoro-timer"
import { getTodaySessions } from "@/lib/actions/timer"
import { getTodos } from "@/lib/actions/todos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, Briefcase, Flame, CheckCircle2 } from "lucide-react"
import { getLang, getDictionary } from "@/i18n/dict"
import { TodoItem } from "@/components/todos/todo-item"
import { CreateTodoDialog } from "@/components/todos/create-todo-dialog"

export default async function FocusPage() {
  const lang = await getLang();
  const dict = getDictionary(lang);
  
  const [sessionsRes, todosRes] = await Promise.all([
    getTodaySessions(),
    getTodos()
  ]);
  
  const sessions = sessionsRes.sessions;
  const error = sessionsRes.error;
  const todos = todosRes.todos || [];
  
  const pendingTodos = todos.filter((t: any) => t.status !== 'DONE');

  const totalWorkMinutes = sessions?.filter((s: any) => s.type === 'WORK' && s.completed).reduce((acc: number, s: any) => acc + s.duration_minutes, 0) || 0;
  const completedPomodoros = sessions?.filter((s: any) => s.type === 'WORK' && s.completed).length || 0;

  return (
    <div className="flex flex-col gap-6 lg:flex-row h-full">
      {/* Left Column: Timer & Stats */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <div>
          <h1 className="font-sans font-bold tracking-tight text-3xl">{dict.focus.title}</h1>
          <p className="text-muted-foreground mt-1">{dict.focus.subtitle}</p>
        </div>

        <PomodoroTimer />
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Flame className="h-6 w-6 text-red-500 mb-2" />
              <div className="text-2xl font-sans font-bold tracking-tight">{completedPomodoros}</div>
              <div className="text-xs text-muted-foreground">{dict.focus.pomodorosToday}</div>
            </CardContent>
          </Card>
          <Card className="glass-panel border-border/50">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-6 w-6 text-accent mb-2" />
              <div className="text-2xl font-sans font-bold tracking-tight">
                {Math.floor(totalWorkMinutes / 60)}ч {totalWorkMinutes % 60}м
              </div>
              <div className="text-xs text-muted-foreground">{dict.focus.inDeepFocus}</div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card className="glass-panel border-border/50 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{dict.focus.history}</CardTitle>
            <CardDescription>{dict.focus.completedSessions}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : sessions?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{dict.focus.noSessions}</p>
            ) : (
              sessions?.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${session.type === 'WORK' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {session.type === 'WORK' ? <Flame className="h-4 w-4" /> : <Coffee className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {session.type === 'WORK' ? dict.focus.focus : dict.focus.break} ({session.duration_minutes}м)
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

      {/* Right Column: Tasks */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:pt-[76px]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{dict.focus.tasks}</h2>
            <p className="text-sm text-muted-foreground">{dict.focus.tasksDesc}</p>
          </div>
          <CreateTodoDialog projects={[]} />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-24">
          {pendingTodos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-white rounded-[24px] border border-gray-100/50 shadow-sm">
              <CheckCircle2 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>{dict.dashboard.allTasksDone}</p>
            </div>
          ) : (
            pendingTodos.map((todo: any) => (
              <TodoItem key={todo.id} task={todo} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
