import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Play, TrendingUp, Clock, Wallet, Users, ArrowRight, Briefcase, Flame } from "lucide-react"
import { DashboardTimerCard } from "@/components/timer/dashboard-timer-card"
import { getDashboardData } from "@/lib/actions/dashboard"
import Link from "next/link"
import { TodoItem } from "@/components/todos/todo-item"
import { getLang, getDictionary } from "@/i18n/dict"

export default async function DashboardPage() {
  const lang = await getLang();
  const dict = getDictionary(lang);
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
          <h1 className="font-sans font-bold tracking-tight text-3xl">{dict.dashboard.welcome}, Jkhan</h1>
          <p className="text-muted-foreground mt-1">{dict.dashboard.subtitle}</p>
        </div>
        <Button asChild className="bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] rounded-full hover:bg-[var(--on-surface)] transition-all duration-300 px-6">
          <Link href="/focus">
            <Play className="mr-2 h-4 w-4" /> {dict.dashboard.startTimer}
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные Проекты</CardTitle>
            <div className="text-primary bg-primary-container/20 p-2 rounded-lg">
              <Briefcase className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-sans font-bold tracking-tight">{data.activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              В работе на данный момент
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-sm transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидаемый Доход</CardTitle>
            <div className="text-secondary bg-secondary-container p-2 rounded-lg">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold tracking-tight">{formatUZS(data.totalRevenue)} <span className="text-sm text-muted-foreground font-sans">UZS</span></div>
            <p className="text-xs text-muted-foreground mt-1">
              В этом месяце
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Фокус Сегодня</CardTitle>
            <div className="text-error bg-error-container/50 p-2 rounded-lg">
              <Flame className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-sans font-bold tracking-tight">{hours}ч {minutes}м</div>
            <p className="text-xs text-muted-foreground mt-1">
              Время в Pomodoro сессиях
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-sm transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новые Клиенты</CardTitle>
            <div className="text-tertiary bg-tertiary-container/20 p-2 rounded-lg">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold tracking-tight">{data.newClientsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Требуют внимания
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-7 lg:grid-cols-7 mt-8">
        {/* Pending Tasks */}
        <Card className="col-span-4 lg:col-span-4 bg-surface-container-lowest border-outline-variant rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>{dict.dashboard.pendingTasks}</CardTitle>
            <CardDescription>
              {dict.dashboard.pendingTasksDesc}
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
                <p>{dict.dashboard.allTasksDone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Info */}
        <Card className="col-span-3 lg:col-span-3 bg-surface-container-lowest border-outline-variant rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>{dict.dashboard.focusTime}</CardTitle>
            <CardDescription>
              {dict.dashboard.focusDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <DashboardTimerCard />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
