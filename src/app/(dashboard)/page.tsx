import { Play, Briefcase, Wallet, Flame, Users } from "lucide-react"
import { DashboardTasksList } from "@/components/dashboard/dashboard-tasks-list"
import { DashboardTimerWidget } from "@/components/dashboard/dashboard-timer-widget"

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-[1200px] w-full mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-1">Добро пожаловать, Jkhan</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm">Вот что происходит с вашими проектами сегодня.</p>
        </div>
        <button className="bg-primary hover:bg-blue-600 text-white flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Play className="w-4 h-4 fill-current" />
          Запустить Таймер
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Активные Проекты</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-1">1</div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">В работе на данный момент</div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Ожидаемый Доход</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-1">500 200 <span className="text-lg text-text-muted-light dark:text-text-muted-dark font-medium">UZS</span></div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">В этом месяце</div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Фокус Сегодня</span>
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-1">0ч 0м</div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Время в Pomodoro сессиях</div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Новые Клиенты</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-1">3</div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Требуют внимания</div>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardTasksList />
        </div>
        <div className="lg:col-span-1">
          <DashboardTimerWidget />
        </div>
      </div>
    </div>
  )
}
