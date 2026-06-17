"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, CalendarClock, GripVertical } from "lucide-react"

export function KanbanCard({ project }: { project: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: project.id,
    data: {
      type: "Project",
      project,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="touch-none"
    >
      <Card className="glass-panel border-border/50 hover:border-primary/40 cursor-grab active:cursor-grabbing mb-3 group shadow-sm hover:shadow-glow transition-all">
        <CardHeader className="p-3 pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              {project.display_id}
            </span>
          </div>
          <div {...listeners} {...attributes} className="text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1 -m-1 rounded">
            <GripVertical className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex flex-col gap-2">
          <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
            {project.title}
          </CardTitle>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Briefcase className="h-3.5 w-3.5 opacity-70" />
            <span className="line-clamp-1">{project.clients?.name || 'Без клиента'}</span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <span className="text-xs font-sans font-bold tracking-tight text-accent">
              {new Intl.NumberFormat('ru-RU').format(project.total_price)} {project.currency || 'UZS'}
            </span>
            {project.deadline && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">
                <CalendarClock className="h-3 w-3" />
                {new Date(project.deadline).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
