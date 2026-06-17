import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Play, TrendingUp, Clock, Wallet, Users, ArrowRight, Briefcase, Flame } from "lucide-react"
import { DashboardTimerCard } from "@/components/timer/dashboard-timer-card"
import { getDashboardData } from "@/lib/actions/dashboard"
import Link from "next/link"
import { TodoItem } from "@/components/todos/todo-item"

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  if ("error" in data) {
    return <div className="p-4 text-destructive">Ошибка загрузки: {data.error}</div>;
  }

  const formatUZS = (val: number) => new Intl.NumberFormat('ru-RU').format(val || 0);
  const hours = Math.floor((data.todayFocusMinutes || 0) / 60);
  const minutes = (data.todayFocusMinutes || 0) % 60;

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="font-sans font-bold tracking-tight text-3xl font-bold tracking-tight">Добро пожаловать, Jkhan</h1>
          <p className="text-muted-foreground mt-1">Вот что происходит с вашими проектами сегодня.</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:scale-105 transition-transform shadow-glow">
          <Link href="/timer">
            <Play className="mr-2 h-4 w-4" /> Запустить Таймер
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-panel border-border/50 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные Проекты</CardTitle>
            <Briefcase className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-sans font-bold tracking-tight">{data.activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              В работе на данный момент
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel glass-panel-hover transition-smooth border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидаемый Доход</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans font-bold tracking-tight">{formatUZS(data.totalRevenue)} <span className="text-sm text-muted-foreground font-sans">UZS</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              В этом месяце
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Фокус Сегодня</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-sans font-bold tracking-tight">{hours}ч {minutes}м</div>
            <p className="text-xs text-muted-foreground mt-1">
              Время в Pomodoro сессиях
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel glass-panel-hover transition-smooth border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые Клиенты</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans font-bold tracking-tight">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Требуют внимания
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-7 lg:grid-cols-7 mt-8">
        {/* Pending Tasks */}
        <Card className="col-span-4 lg:col-span-4 glass-panel border-border/50">
          <CardHeader>
            <CardTitle>Текущие Задачи</CardTitle>
            <CardDescription>
              Ваши задачи в статусе "Нужно сделать" или "В работе".
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.pendingTasks && data.pendingTasks.length > 0 ? (
              <div className="space-y-4">
                {data.pendingTasks.map((task: any) => (
                  <TodoItem key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Все текущие задачи выполнены!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Info */}
        <Card className="col-span-3 lg:col-span-3 glass-panel border-border/50 flex flex-col items-center justify-center text-center p-6">
          <CardHeader>
            <CardTitle>Время фокусировки</CardTitle>
            <CardDescription>Управляйте таймером отсюда.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center w-full">
            <DashboardTimerCard />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
