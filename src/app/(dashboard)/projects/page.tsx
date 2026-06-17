import { getProjects } from "@/lib/actions/projects"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Briefcase, LayoutGrid, List } from "lucide-react"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanBoard } from "@/components/projects/kanban-board"

export default async function ProjectsPage() {
  const { projects, error } = await getProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold tracking-tight text-3xl font-bold tracking-tight">Управление Проектами</h1>
          <p className="text-muted-foreground mt-1">Отслеживайте статусы, финансы и дедлайны по всем вашим проектам.</p>
        </div>
        <div className="flex gap-2">
          <CreateProjectDialog />
        </div>
      </div>

      <Tabs defaultValue="board" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-background/50 border border-border/50">
            <TabsTrigger value="board" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <LayoutGrid className="h-4 w-4 mr-2" /> Доска
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <List className="h-4 w-4 mr-2" /> Список
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="board" className="m-0 focus-visible:outline-none focus-visible:ring-0">
          <KanbanBoard initialProjects={projects || []} />
        </TabsContent>

        <TabsContent value="list" className="m-0 focus-visible:outline-none focus-visible:ring-0">
          <Card className="glass-panel border-border/50 animate-fade-in">
        <CardHeader>
          <CardTitle>Все Проекты</CardTitle>
          <CardDescription>Полный список ваших текущих и завершенных проектов.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              Ошибка при загрузке данных: {error}
              <br />
              Убедитесь, что база данных Supabase настроена и RLS политики позволяют чтение.
            </div>
          ) : projects && projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Бюджет</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project: any) => (
                  <TableRow key={project.id} className="border-border/50 hover:bg-muted/40 transition-smooth cursor-pointer">
                    <TableCell className="font-mono text-xs text-muted-foreground">{project.display_id}</TableCell>
                    <TableCell className="font-medium text-foreground">{project.title}</TableCell>
                    <TableCell>{project.clients?.name || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        project.status === 'NEW' ? 'border-blue-500 text-blue-500' :
                        project.status === 'IN_PROGRESS' ? 'border-accent text-accent' :
                        project.status === 'READY' ? 'border-yellow-500 text-yellow-500' :
                        project.status === 'PAID' ? 'border-green-500 text-green-500' :
                        'border-muted-foreground text-muted-foreground'
                      }>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('ru-RU').format(project.total_price)} {project.currency || 'UZS'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">Нет проектов</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Вы еще не создали ни одного проекта. Нажмите кнопку, чтобы начать.
              </p>
              <CreateProjectDialog />
            </div>
          )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  )
}
