import { getTodos } from "@/lib/actions/todos"
import { getProjects } from "@/lib/actions/projects"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle2, Circle, Clock, Briefcase } from "lucide-react"
import { CreateTodoDialog } from "@/components/todos/create-todo-dialog"
import { TodoItem } from "@/components/todos/todo-item"

// A simple client component wrapper for the Create Task Dialog could be added later,
// For now, we scaffold the UI.

export default async function TodosPage() {
  const { todos, error } = await getTodos();
  
  const notStarted = todos?.filter((t: any) => t.status === 'NOT_STARTED') || [];
  const inProgress = todos?.filter((t: any) => t.status === 'IN_PROGRESS') || [];
  const done = todos?.filter((t: any) => t.status === 'DONE') || [];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold tracking-tight text-3xl font-bold tracking-tight">Задачи</h1>
          <p className="text-muted-foreground mt-1">Организуйте свою работу и следите за прогрессом.</p>
        </div>
        <div className="flex gap-2">
          <CreateTodoDialog />
        </div>
      </div>

      {error ? (
        <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          Ошибка: {error}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Column: To Do */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2">
                <Circle className="h-4 w-4 text-muted-foreground" /> Нужно сделать
              </h3>
              <Badge variant="secondary">{notStarted.length}</Badge>
            </div>
            <div className="glass-panel border-border/50 rounded-xl p-3 min-h-[200px]">
              {notStarted.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-8">Нет новых задач</p>
              ) : (
                notStarted.map((task: any) => <TodoItem key={task.id} task={task} />)
              )}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2 text-accent">
                <Clock className="h-4 w-4" /> В работе
              </h3>
              <Badge className="bg-accent text-accent-foreground">{inProgress.length}</Badge>
            </div>
            <div className="glass-panel border-accent/20 bg-accent/5 rounded-xl p-3 min-h-[200px]">
              {inProgress.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-8">Пусто</p>
              ) : (
                inProgress.map((task: any) => <TodoItem key={task.id} task={task} />)
              )}
            </div>
          </div>

          {/* Column: Done */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-4 w-4" /> Готово
              </h3>
              <Badge variant="outline" className="text-green-500 border-green-500/20">{done.length}</Badge>
            </div>
            <div className="glass-panel border-border/50 opacity-60 rounded-xl p-3 min-h-[200px]">
              {done.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-8">Пока нет завершенных</p>
              ) : (
                done.map((task: any) => <TodoItem key={task.id} task={task} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
