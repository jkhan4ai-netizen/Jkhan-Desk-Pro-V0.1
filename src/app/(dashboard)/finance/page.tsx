import { getFinanceStats, getExpenses, getFinanceChartData } from "@/lib/actions/finance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Wallet, TrendingUp, TrendingDown, Landmark } from "lucide-react"
import { AddExpenseDialog } from "@/components/finance/add-expense-dialog"
import { FinanceChart } from "@/components/finance/finance-chart"

export default async function FinancePage() {
  const { stats, error: statsError } = await getFinanceStats();
  const { expenses, error: expError } = await getExpenses();
  const { data: chartData } = await getFinanceChartData();

  const formatUZS = (val: number) => new Intl.NumberFormat('ru-RU').format(val || 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-calistoga text-3xl font-bold tracking-tight">Финансы</h1>
          <p className="text-muted-foreground mt-1">Отслеживайте свои доходы, расходы и чистую прибыль.</p>
        </div>
        <div className="flex gap-2">
          <AddExpenseDialog />
        </div>
      </div>

      {statsError ? (
        <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md border border-destructive/20">
           Ошибка: {statsError}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-panel border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Фактический Доход</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-accent">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-calistoga">{formatUZS(stats?.totalReceived || 0)} <span className="text-sm font-sans text-muted-foreground">UZS</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                Получено на руки
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Чистая Прибыль</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-green-500">
                <Landmark className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-calistoga text-green-500">{formatUZS(stats?.netProfit || 0)} <span className="text-sm font-sans text-muted-foreground">UZS</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                После вычета расходов
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Дебиторская Задолженность</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-yellow-500">
                <Wallet className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-calistoga text-yellow-500">{formatUZS(stats?.expectedDebts || 0)} <span className="text-sm font-sans text-muted-foreground">UZS</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                Ожидается от клиентов
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Расходы (Издержки)</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-destructive">
                <TrendingDown className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-calistoga text-destructive">{formatUZS(stats?.totalExpenses || 0)} <span className="text-sm font-sans text-muted-foreground">UZS</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                Софт, подписки, подрядчики
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {chartData && chartData.length > 0 && (
        <FinanceChart data={chartData} />
      )}

      <Card className="glass-panel border-border/50 mt-4">
        <CardHeader>
          <CardTitle>История Расходов</CardTitle>
          <CardDescription>Последние списания и траты.</CardDescription>
        </CardHeader>
        <CardContent>
          {expError ? (
            <div className="text-destructive text-sm">{expError}</div>
          ) : expenses && expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>Дата</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp: any) => (
                  <TableRow key={exp.id} className="border-border/50 hover:bg-muted/40 transition-smooth">
                    <TableCell className="text-muted-foreground">{new Date(exp.date).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell className="font-medium text-foreground">{exp.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={exp.type === 'RECURRING' ? 'border-accent text-accent' : 'border-muted-foreground text-muted-foreground'}>
                        {exp.type === 'RECURRING' ? 'Подписка' : 'Разовый'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      - {new Intl.NumberFormat('ru-RU').format(exp.amount)} {exp.currency}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <TrendingDown className="h-8 w-8 mb-4 opacity-50" />
              <p className="text-sm max-w-sm">
                Вы еще не добавили ни одного расхода. Это хорошее время начать контролировать свои издержки.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
